import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../environments/environment';

@Pipe({ name: 'assetUrl' })
export class AssetUrlPipe implements PipeTransform {
  constructor() {
  }

  transform(url: any): string {
    if (!url) {
      return '';
    }
    let baseUrl = environment.assets.baseUrl;
    if (!baseUrl) {
      return url;
    }
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    let urlStr = url.toString();
    if (urlStr.startsWith('/')) {
      urlStr = urlStr.substr(1);
    }
    return baseUrl + urlStr;
  }
}
