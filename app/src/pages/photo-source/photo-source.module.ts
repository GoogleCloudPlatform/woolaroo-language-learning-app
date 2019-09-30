import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PhotoSourcePageComponent } from './photo-source';
import { UploadImageButtonModule } from 'components/upload-image-button/upload-image-button.module';

@NgModule({
  declarations: [
    PhotoSourcePageComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    UploadImageButtonModule
  ]
})
export class PhotoSourcePageModule {}
