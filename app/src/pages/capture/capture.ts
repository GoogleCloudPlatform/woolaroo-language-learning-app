import { Component, ViewChild } from '@angular/core';
import { CameraPreviewComponent, CameraPreviewStatus } from "../../components/camera-preview/camera-preview";
import { Router } from "@angular/router";

@Component({
  selector: 'page-capture',
  templateUrl: 'capture.html',
  styleUrls: ['./capture.scss']
})
export class CapturePage {
  @ViewChild(CameraPreviewComponent, {static: false})
  private cameraPreview:CameraPreviewComponent;
  public captureInProgress:boolean = false;

  constructor(private router:Router) {
  }

  ngAfterViewInit() {
    this.cameraPreview.start().then(
      () => console.log("Camera started"),
      err => console.warn("Error starting camera: " + err)
    );
  }

  onCaptureClick() {
    if(this.cameraPreview.status !== CameraPreviewStatus.Started) {
      return;
    }
    this.captureInProgress = true;
    this.cameraPreview.capture().then(
      image => {
        console.log("Image captured");
        this.router.navigate(['/translate'], {state: {capturedImage: image}});
      },
      err => {
        console.warn('Failed to capture image', err);
        this.captureInProgress = false;
        this.onCaptureError(err);
      }
    )
  }

  onCaptureError(err) {
    // TODO
  }
}
