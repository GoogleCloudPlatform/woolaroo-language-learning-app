import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { CapturePopUpComponent } from './capture-popup';

@NgModule({
  declarations: [
    CapturePopUpComponent
  ],
  exports: [
    CapturePopUpComponent
  ],
  imports: [
    MatDialogModule
  ],
  entryComponents: [
    CapturePopUpComponent
  ]
})
export class CapturePopUpModule {}
