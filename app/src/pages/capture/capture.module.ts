import { NgModule } from '@angular/core';
import { CapturePage } from './capture';
import { CameraPreviewComponentModule } from 'components/camera-preview/camera-preview.module';
import { IconComponentModule } from 'components/icon/icon.module';

@NgModule({
  declarations: [
    CapturePage,
  ],
  imports: [
    IconComponentModule,
    CameraPreviewComponentModule
  ]
})
export class CapturePageModule {}
