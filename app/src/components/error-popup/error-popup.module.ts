import { NgModule } from '@angular/core';
import { MatDialogModule, MatButtonModule } from "@angular/material";
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
