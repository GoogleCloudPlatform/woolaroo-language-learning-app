import {Component, ViewChild} from '@angular/core';
import {CameraPreviewComponent} from "../../components/camera-preview/camera-preview";
import {Router} from "@angular/router";

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

  async onCaptureClick() {
    this.captureInProgress = true;
    try {
      const image = await this.cameraPreview.capture();
      console.log("Image captured");
      this.router.navigate(['/translate'], {state: {capturedImage: image}});
    } catch(err) {
      console.warn('Failed to capture image', err);
      alert(err);
      this.captureInProgress = false;
      this.onCaptureError(err);
    }
  }

  onCaptureError(err) {
    // TODO
  }
}
