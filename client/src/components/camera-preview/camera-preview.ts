import {
  Component,
  Output,
  ViewChild,
  HostListener,
  EventEmitter,
  OnDestroy, ElementRef, InjectionToken, Inject, Input
} from '@angular/core';
import { canvasToBlob } from 'util/image';
import { cameraStreamIsAvailable } from 'util/camera';
import {getLogger} from 'util/logging';

interface CameraPreviewConfig {
  resizeDelay: number;
}

export const CAMERA_PREVIEW_CONFIG = new InjectionToken<CameraPreviewConfig>('Capture image page config');

export enum CameraPreviewStatus {
  Stopped,
  Started,
  Starting
}

const logger = getLogger('CameraPreviewComponent');

@Component({
  selector: 'app-camera-preview',
  templateUrl: 'camera-preview.html',
  styleUrls: ['./camera-preview.scss']
})
export class CameraPreviewComponent implements OnDestroy {
  @ViewChild('video')
  private videoRef: ElementRef|null = null;
  @ViewChild('capturedImage')
  private capturedImage: ElementRef|null = null;
  private videoStream: MediaStream|null = null;
  private videoResizeTimer: any;
  private _status: CameraPreviewStatus;
  public get status(): CameraPreviewStatus { return this._status; }
  private get video(): HTMLVideoElement|null { return this.videoRef ? this.videoRef.nativeElement as HTMLVideoElement : null; }

  @Output()
  videoError: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    @Inject(CAMERA_PREVIEW_CONFIG) private config: CameraPreviewConfig) {
    this._status = CameraPreviewStatus.Stopped;
  }

  ngOnDestroy() {
    this.stop();
  }

  async capture(): Promise<Blob> {
    const video = this.video;
    if (!video || !this.capturedImage || !this.capturedImage.nativeElement) {
      throw new Error('Component not ready');
    }
    const canvas = this.capturedImage.nativeElement as HTMLCanvasElement;
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    // dimensions need to be relative to video, not the video element, so we need to scale
    const scale = Math.max(width / videoWidth, height / videoHeight);
    const dx = (videoWidth - width / scale) * 0.5;
    const dy = (videoHeight - height / scale) * 0.5;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed creating 2D canvas context');
    }
    context.drawImage(video, dx, dy, videoWidth - 2 * dx, videoHeight - 2 * dy, 0, 0, width, height);
    return await canvasToBlob(canvas);
  }

  async start(): Promise<any> {
    if (!cameraStreamIsAvailable()) {
      throw new Error('User media not supported');
    } else if (this.status !== CameraPreviewStatus.Stopped) {
      throw new Error('Video stream already started');
    } else if (!this.video) {
      throw new Error('Component not ready');
    }
    logger.log('Starting video stream');
    this._status = CameraPreviewStatus.Starting;
    // assume full window size
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let desiredWidth = windowWidth * window.devicePixelRatio;
    let desiredHeight = windowHeight * window.devicePixelRatio;
    if (desiredWidth < desiredHeight) {
      // have to flip requested video dimensions when in portrait mode
      const tmp = desiredWidth;
      desiredWidth = desiredHeight;
      desiredHeight = tmp;
    }
    const video = this.video;
    logger.log(`Requesting video at ${desiredWidth}x${desiredHeight}`);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video:
          { width: desiredWidth, height: desiredHeight, facingMode: 'environment' } });
      this.videoStream = stream;
      video.srcObject = stream;
    } catch (err) {
      if (err instanceof DOMException) {
        logger.warn('Unable to get video stream with ideal dimensions, trying default dimensions.', err);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' } });
        this.videoStream = stream;
        video.srcObject = stream;
      } else {
        logger.warn('Unable to start video stream.', err);
        throw err;
      }
    }
    await video.play();
    logger.log(`Video stream started at ${video.videoWidth}x${video.videoHeight}`);
    this._status = CameraPreviewStatus.Started;
    for (const track of this.videoStream.getTracks()) {
      track.addEventListener('ended', this.onVideoStreamEnded);
    }
    if (windowWidth !== window.innerWidth || windowHeight !== window.innerHeight) {
      logger.log('Window size has changed - restarting video');
      await this.restart();
    }
  }

  async restart(): Promise<any> {
    this.stop();
    await this.start();
  }

  stop() {
    if (this.videoStream) {
      logger.log('Stopping video stream');
      for (const track of this.videoStream.getTracks()) {
        track.removeEventListener('ended', this.onVideoStreamEnded);
        track.stop();
      }
      this.videoStream = null;
    }
    this.stopVideoResizeTimer();
    if (this.video) {
      this.video.srcObject = null;
    }
    this._status = CameraPreviewStatus.Stopped;
  }

  private onVideoStreamEnded = () => {
    logger.warn('Video stream ended');
    this.stop();
    this.videoError.emit(new Error('Video ended'));
  }

  private startVideoResizeTimer() {
    if (this.videoResizeTimer) {
      clearTimeout(this.videoResizeTimer);
    }
    this.videoResizeTimer = setTimeout(() => this.onVideoResizeTimerElapsed(), this.config.resizeDelay);
  }

  private stopVideoResizeTimer() {
    if (this.videoResizeTimer) {
      clearTimeout(this.videoResizeTimer);
      this.videoResizeTimer = null;
    }
  }

  private onVideoResizeTimerElapsed() {
    switch (this._status) {
      case CameraPreviewStatus.Started:
        this.restart().then(
          () => logger.log('Video restarted'),
          err => {
            logger.log('Error restarting video: ' + err);
            this.videoError.emit(err);
          }
        );
        break;
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    switch (this._status) {
      case CameraPreviewStatus.Started:
        this.startVideoResizeTimer();
        break;
    }
  }
}
