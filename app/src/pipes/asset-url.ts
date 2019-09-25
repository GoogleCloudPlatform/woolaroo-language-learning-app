import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Pipe({ name: 'assetUrl' })
export class AssetUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(url: any): SafeStyle {
    if (!url) {
      return '';
    }
    url = this.sanitizer.sanitize(SecurityContext.URL, url);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
