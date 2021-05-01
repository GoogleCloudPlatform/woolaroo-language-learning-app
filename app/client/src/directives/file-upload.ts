import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[appFileUpload]'
})
export class FileUploadDirective implements OnDestroy {
  private readonly uploadField: HTMLInputElement;

  private _acceptedFileTypes = '';
  public get acceptedFileTypes(): string { return this._acceptedFileTypes; }
  @Input('accept')
  public set acceptedFileTypes(value: string) {
    this._acceptedFileTypes = value;
    this.uploadField.accept = value;
  }

  private _capture = false;
  public get capture(): boolean { return this._capture; }
  @Input()
  public set capture(value: boolean) {
    this._capture = value;
    if (value) {
      this.uploadField.setAttribute('capture', '');
    } else {
      this.uploadField.removeAttribute('capture');
    }
  }

  @Output('appFileUpload')
  public fileUploaded: EventEmitter<File> = new EventEmitter();

  constructor(private element: ElementRef) {
    const el = this.element.nativeElement as HTMLElement;
    const upload = document.createElement('input');
    upload.type = 'file';
    upload.accept = this.acceptedFileTypes;
    if (this.capture) {
      upload.setAttribute('capture', '');
    }
    upload.style.display = 'none';
    el.append(upload);
    upload.addEventListener('change', this.onFileUploaded);
    this.uploadField = upload;
  }

  onFileUploaded = () => {
    const files = this.uploadField.files;
    if ( !files ) {
      return;
    }
    const file = files[0];
    this.fileUploaded.emit(file);
  }

  @HostListener('click')
  onClick = () => {
    this.uploadField.click();
  }

  ngOnDestroy(): void {
    if (this.uploadField) {
      this.uploadField.removeEventListener('change', this.onFileUploaded);
    }
  }
}
