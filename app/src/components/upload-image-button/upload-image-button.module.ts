import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UploadImageButtonComponent } from './upload-image-button';

@NgModule({
  declarations: [
    UploadImageButtonComponent
  ],
  exports: [
    UploadImageButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class UploadImageButtonModule {}
