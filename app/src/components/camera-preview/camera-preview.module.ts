import { NgModule } from '@angular/core';
import { CameraPreviewComponent } from './camera-preview';

@NgModule({
  declarations: [
    CameraPreviewComponent
  ],
  exports: [
    CameraPreviewComponent
  ]
})
export class CameraPreviewComponentModule {}
