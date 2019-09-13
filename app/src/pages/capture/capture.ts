import {Component, ViewChild} from '@angular/core';
import {CameraPreviewComponent} from "../../components/camera-preview/camera-preview";

@Component({
  selector: 'page-capture',
  templateUrl: 'capture.html',
  styleUrls: ['./capture.scss']
})
export class CapturePage {
  @ViewChild(CameraPreviewComponent, {static: false})
  private cameraPreview:CameraPreviewComponent;

  onStartClick() {
  }
}
