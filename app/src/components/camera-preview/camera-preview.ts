import {
  Component,
  Input,
  Output,
  ViewChild,
  HostListener,
  EventEmitter,
  OnDestroy, ElementRef
} from '@angular/core';
import {environment} from '../../environments/environment';
import {canvasToBlob} from "../../util/image";

enum CameraPreviewStatus {
  Stopped,
  Started,
  Starting
}

@Component({
  selector: 'camera-preview',
  templateUrl: 'camera-preview.html',
  styleUrls: ['./camera-preview.scss']
})
export class CameraPreviewComponent implements OnDestroy {
  private videoStream:MediaStream;
  @ViewChild('video', {static: false})
  private videoRef:ElementRef;
  @ViewChild('capturedImage', {static: false})
  private capturedImage:ElementRef;
  private lastResizeTime:number = -1;
  private sizeDirty:boolean = false;
  private status:CameraPreviewStatus;
  private videoResizeTimer:any;
  private static get requestedVideoWidth():number { return window.innerWidth * window.devicePixelRatio; }
  private static get requestedVideoHeight():number { return window.innerHeight * window.devicePixelRatio; }
  private get video():HTMLVideoElement { return this.videoRef.nativeElement as HTMLVideoElement; }
  private get videoWidth():number { return this.videoStream ? this.video.videoWidth : 0; }
  private get videoHeight():number { return this.videoStream ? this.video.videoHeight : 0; }

  @Input()
  autostart:boolean;
  @Output()
  videoError:EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.status = CameraPreviewStatus.Stopped;
  }

  ngAfterViewInit() {
    if(this.autostart) {
      this.start();
    }
  }

  ngOnDestroy() {
    this.stop();
  }

  async capture():Promise<Blob> {
    const canvas = this.capturedImage.nativeElement as HTMLCanvasElement;
    const width = canvas.width = window.screen.width;
    const height = canvas.height = window.screen.height;
    const video = this.video;
    const scale = Math.max(width / video.videoWidth, height / video.videoHeight); // dimensions need to be relative to video, not the video element, so we need to scale
    const dx = (width / scale - this.videoWidth) * 0.5;
    const dy = (height / scale - this.videoHeight) * 0.5;
    const context = canvas.getContext('2d');
    context.drawImage(video, dx, dy, this.videoWidth - 2 * dx, this.videoHeight - 2 * dy, 0, 0, width, height);
    return await canvasToBlob(canvas);
  }

  async start():Promise<any> {
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return Promise.reject('User media not supported');
    } else if(this.status != CameraPreviewStatus.Stopped) {
      return Promise.reject('Video stream already started');
    }
    console.log('Starting video stream');
    this.status = CameraPreviewStatus.Starting;
    // HACK: video element dimensions have not been initialized yet, so we need to just assume full size
    let requestedWidth = CameraPreviewComponent.requestedVideoWidth;
    let requestedHeight = CameraPreviewComponent.requestedVideoHeight;
    if(requestedWidth < requestedHeight) {
      // have to flip requested video dimensions when in portrait mode
      const tmp = requestedWidth;
      requestedWidth = requestedHeight;
      requestedHeight = tmp;
    }
    const video = this.video;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { width: requestedWidth, height: requestedHeight, facingMode: 'environment' } });
      this.videoStream = stream;
      video.srcObject = stream;
    } catch(err) {
      console.warn("Unable to get video stream with ideal dimensions, trying default dimensions.", err);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' } });
      this.videoStream = stream;
      video.srcObject = stream;
    }
    await video.play();
    this.resizeVideo();
    console.log('Video stream started at ' + video.videoWidth + 'x' + video.videoHeight);
    this.status = CameraPreviewStatus.Started;
    for(let track of this.videoStream.getTracks()) {
      track.addEventListener('ended', this.onVideoStreamEnded);
    }
    if(this.sizeDirty) {
      this.sizeDirty = false;
      this.stop();
      this.start();
    }
  }

  stop() {
    if(this.videoStream) {
      console.log('Stopping video stream');
      for(let track of this.videoStream.getTracks()) {
        track.removeEventListener('ended', this.onVideoStreamEnded);
        track.stop();
      }
      this.videoStream = null;
    }
    this.video.srcObject = null;
    this.status = CameraPreviewStatus.Stopped;
  }

  private onVideoStreamEnded = () => {
    console.warn('Video stream ended');
    this.stop();
    this.videoError.emit(new Error('Video ended'));
  };

  private resizeVideo() {
    let desiredWidth = window.innerWidth;
    let desiredHeight = window.innerHeight;
    let videoWidth = this.video.videoWidth;
    let videoHeight = this.video.videoHeight;
    let scale = Math.max(desiredWidth / videoWidth, desiredHeight / videoHeight); // scale which will cover full screen
    let width = Math.round(scale * videoWidth);
    let height = Math.round(scale * videoHeight);
    this.video.style.width = width + "px";
    this.video.style.height = height + "px";
    this.video.style.left = (desiredWidth - width) * 0.5 + "px";
    this.video.style.top = (desiredHeight - height) * 0.5 + "px";
  }

  private startVideoResizeTimer() {
    if(this.videoResizeTimer) {
      clearTimeout(this.videoResizeTimer);
    }
    this.videoResizeTimer = setTimeout(() => this.onVideoResizeTimerElapsed(), environment.capture.resizeDelay);
  }

  private stopVideoResizeTimer() {
    if(this.videoResizeTimer) {
      clearTimeout(this.videoResizeTimer);
      this.videoResizeTimer = null;
    }
  }

  private onVideoResizeTimerElapsed() {
    if(this.status != CameraPreviewStatus.Starting) {
      this.sizeDirty = false;
      this.stop();
      this.start();
    }
  }

  @HostListener('window:resize', ['$event'])
  private onResize() {
    switch(this.status) {
      case CameraPreviewStatus.Starting:
        this.lastResizeTime = Date.now();
        this.sizeDirty = true;
        this.stopVideoResizeTimer();
        break;
      case CameraPreviewStatus.Started:
        this.lastResizeTime = Date.now();
        this.startVideoResizeTimer();
        break;
    }
  }
}
