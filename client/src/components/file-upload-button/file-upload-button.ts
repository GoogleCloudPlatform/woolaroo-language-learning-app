import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload-button',
  templateUrl: './file-upload-button.html',
  styleUrls: ['./file-upload-button.scss']
})
export class FileUploadButtonComponent {
  @Output()
  imageUploaded = new EventEmitter<Blob>();
  @Input()
  accept = '*';
  @Input()
  captureOnly = false;

  onFileChanged(ev: Event) {
    const fileUpload = ev.currentTarget as HTMLInputElement;
    if (!fileUpload.files) {
      return;
    }
    this.imageUploaded.emit(fileUpload.files[0]);
  }
}
