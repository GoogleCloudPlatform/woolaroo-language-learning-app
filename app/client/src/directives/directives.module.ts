import { NgModule } from '@angular/core';
import { FileUploadDirective } from './file-upload';

@NgModule({
  declarations: [
    FileUploadDirective
  ],
  providers: [
    FileUploadDirective
  ],
  exports: [
    FileUploadDirective
  ]
})
export class DirectivesModule {}
