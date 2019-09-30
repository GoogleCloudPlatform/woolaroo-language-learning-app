import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-image-button',
  templateUrl: './upload-image-button.html',
  styleUrls: ['./upload-image-button.scss']
})
export class UploadImageButtonComponent {
  @Output()
  imageUploaded = new EventEmitter<Blob>();
  elementID = Date.now().toString().replace('.', '');

  onFileChanged(ev: Event) {
    const fileUpload = ev.currentTarget as HTMLInputElement;
    if (!fileUpload.files) {
      return;
    }
    this.imageUploaded.emit(fileUpload.files[0]);
  }
}
