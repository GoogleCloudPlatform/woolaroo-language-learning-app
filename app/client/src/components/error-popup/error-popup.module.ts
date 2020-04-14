import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { ErrorPopUpComponent } from './error-popup';

@NgModule({
  declarations: [
    ErrorPopUpComponent
  ],
  exports: [
    ErrorPopUpComponent
  ],
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  entryComponents: [
    ErrorPopUpComponent
  ]
})
export class ErrorPopUpModule {}
