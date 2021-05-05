import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Pipe({ name: 'styleUrl' })
export class StyleUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(url:any): SafeStyle {
    if (!url) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustStyle(`url('${url}')`);
  }
}
