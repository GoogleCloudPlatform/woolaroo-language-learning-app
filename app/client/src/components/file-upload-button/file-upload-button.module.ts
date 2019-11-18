import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadButtonComponent } from './file-upload-button';

@NgModule({
  declarations: [
    FileUploadButtonComponent
  ],
  exports: [
    FileUploadButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class FileUploadButtonModule {}
