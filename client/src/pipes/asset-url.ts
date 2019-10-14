import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Pipe({ name: 'assetUrl' })
export class AssetUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(url: any): SafeStyle {
    if (!url) {
      return '';
    }
    let baseUrl = environment.assets.baseUrl;
    if (!baseUrl) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    let urlStr = url.toString();
    if (urlStr.startsWith('/')) {
      urlStr = urlStr.substr(1);
    }
    return this.sanitizer.bypassSecurityTrustUrl(baseUrl + urlStr);
  }
}
