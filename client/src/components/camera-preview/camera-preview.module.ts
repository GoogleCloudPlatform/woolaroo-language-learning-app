import { NgModule } from '@angular/core';
import { CAMERA_PREVIEW_CONFIG, CameraPreviewComponent } from './camera-preview';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
    CameraPreviewComponent
  ],
  exports: [
    CameraPreviewComponent
  ],
  providers: [
    { provide: CAMERA_PREVIEW_CONFIG, useValue: environment.components.cameraPreview }
  ]
})
export class CameraPreviewModule { }
