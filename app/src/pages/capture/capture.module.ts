import { NgModule } from '@angular/core';
import { CapturePage } from './capture';
import { CameraPreviewComponentModule } from "../../components/camera-preview/camera-preview.module";

@NgModule({
  declarations: [
    CapturePage,
  ],
  imports: [
    CameraPreviewComponentModule
  ]
})
export class CapturePageModule {}
