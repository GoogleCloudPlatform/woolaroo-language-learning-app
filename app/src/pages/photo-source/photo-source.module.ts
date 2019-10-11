import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PhotoSourcePageComponent } from './photo-source';
import { FileUploadButtonModule } from 'components/file-upload-button/file-upload-button.module';
import { LoadingPopUpModule } from 'components/loading-popup/loading-popup.module';

@NgModule({
  declarations: [
    PhotoSourcePageComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    FileUploadButtonModule,
    LoadingPopUpModule
  ]
})
export class PhotoSourcePageModule {}
