import {
  Component,
  Output,
  ViewChild,
  HostListener,
  EventEmitter,
  OnDestroy, ElementRef
} from '@angular/core';
import {environment} from 'environments/environment';
import {canvasToBlob} from 'util/image';

export enum CameraPreviewStatus {
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
  @ViewChild('video', {static: false})
  private videoRef:ElementRef|null = null;
  @ViewChild('capturedImage', {static: false})
  private capturedImage:ElementRef|null = null;
  private videoStream:MediaStream|null = null;
  private _status:CameraPreviewStatus;
  public get status():CameraPreviewStatus { return this._status; }
  private videoResizeTimer:any;
  private get video():HTMLVideoElement|null { return this.videoRef ? this.videoRef.nativeElement as HTMLVideoElement : null; }
  private get videoWidth():number { return this.video && this.videoStream ? this.video.videoWidth : 0; }
  private get videoHeight():number { return this.video && this.videoStream ? this.video.videoHeight : 0; }

  @Output()
  videoError:EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this._status = CameraPreviewStatus.Stopped;
  }

  ngOnDestroy() {
    this.stop();
  }

  async capture():Promise<Blob> {
    const canvas = this.capturedImage!.nativeElement as HTMLCanvasElement;
    const width = canvas.width = window.screen.width;
    const height = canvas.height = window.screen.height;
    const video = this.video!;
    const scale = Math.max(width / video.videoWidth, height / video.videoHeight); // dimensions need to be relative to video, not the video element, so we need to scale
    const dx = (width / scale - this.videoWidth) * 0.5;
    const dy = (height / scale - this.videoHeight) * 0.5;
    const context = canvas.getContext('2d');
    context!.drawImage(video, dx, dy, this.videoWidth - 2 * dx, this.videoHeight - 2 * dy, 0, 0, width, height);
    return await canvasToBlob(canvas);
  }

  async start():Promise<any> {
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('User media not supported');
    } else if(this.status != CameraPreviewStatus.Stopped) {
      throw new Error('Video stream already started');
    }
    console.log('Starting video stream');
    this._status = CameraPreviewStatus.Starting;
    // assume full window size
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let desiredWidth = windowWidth * window.devicePixelRatio;
    let desiredHeight = windowHeight * window.devicePixelRatio;
    if(desiredWidth < desiredHeight) {
      // have to flip requested video dimensions when in portrait mode
      const tmp = desiredWidth;
      desiredWidth = desiredHeight;
      desiredHeight = tmp;
    }
    const video = this.video!;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { width: desiredWidth, height: desiredHeight, facingMode: 'environment' } });
      this.videoStream = stream;
      video.srcObject = stream;
    } catch(err) {
      console.warn("Unable to get video stream with ideal dimensions, trying default dimensions.", err);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' } });
      this.videoStream = stream;
      video.srcObject = stream;
    }
    await video.play();
    this.repositionVideo();
    console.log('Video stream started at ' + video.videoWidth + 'x' + video.videoHeight);
    this._status = CameraPreviewStatus.Started;
    for(let track of this.videoStream.getTracks()) {
      track.addEventListener('ended', this.onVideoStreamEnded);
    }
    if(windowWidth != window.innerWidth || windowHeight != window.innerHeight) {
      console.log('Window size has changed - restarting video');
      await this.restart();
    }
  }

  async restart():Promise<any> {
    this.stop();
    await this.start();
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
    this.stopVideoResizeTimer();
    this.video!.srcObject = null;
    this._status = CameraPreviewStatus.Stopped;
  }

  private onVideoStreamEnded = () => {
    console.warn('Video stream ended');
    this.stop();
    this.videoError.emit(new Error('Video ended'));
  };

  private repositionVideo() {
    let desiredWidth = window.innerWidth;
    let desiredHeight = window.innerHeight;
    const video = this.video!;
    let videoWidth = video.videoWidth;
    let videoHeight = video.videoHeight;
    let scale = Math.max(desiredWidth / videoWidth, desiredHeight / videoHeight); // scale which will cover full screen
    let width = Math.round(scale * videoWidth);
    let height = Math.round(scale * videoHeight);
    video.style.width = width + "px";
    video.style.height = height + "px";
    video.style.left = (desiredWidth - width) * 0.5 + "px";
    video.style.top = (desiredHeight - height) * 0.5 + "px";
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
    switch(this._status) {
      case CameraPreviewStatus.Started:
        this.restart().then(
          () => console.log("Video restarted"),
          err => {
            console.log("Error restarting video: " + err);
            this.videoError.emit(err);
          }
        );
        break;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(ev:Event) {
    switch(this._status) {
      case CameraPreviewStatus.Started:
        this.startVideoResizeTimer();
        break;
    }
  }
}
