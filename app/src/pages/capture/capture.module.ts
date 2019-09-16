import { NgModule } from '@angular/core';
import { CapturePage } from './capture';
import { CameraPreviewComponentModule } from 'components/camera-preview/camera-preview.module';
import { IconComponentModule } from 'components/icon/icon.module';
import { ErrorPopUpComponentModule } from 'components/error-popup/error-popup.module';

@NgModule({
  declarations: [
    CapturePage,
  ],
  imports: [
    IconComponentModule,
    CameraPreviewComponentModule,
    ErrorPopUpComponentModule
  ]
})
export class CapturePageModule {}
