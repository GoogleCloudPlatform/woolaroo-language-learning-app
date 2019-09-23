import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material";
import { LoadingPopUpComponent } from './loading-popup';

@NgModule({
  declarations: [
    LoadingPopUpComponent
  ],
  exports: [
    LoadingPopUpComponent
  ],
  imports: [
    MatDialogModule
  ],
  entryComponents: [
    LoadingPopUpComponent
  ]
})
export class LoadingPopUpModule {}
