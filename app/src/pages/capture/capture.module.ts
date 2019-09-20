import { NgModule } from '@angular/core';
import { CapturePage } from './capture';
import { CameraPreviewModule } from 'components/camera-preview/camera-preview.module';
import { IconComponentModule } from 'components/icon/icon.module';
import { ErrorPopUpModule } from 'components/error-popup/error-popup.module';

@NgModule({
  declarations: [
    CapturePage,
  ],
  imports: [
    IconComponentModule,
    CameraPreviewModule,
    ErrorPopUpModule
  ]
})
export class CapturePageModule {}
