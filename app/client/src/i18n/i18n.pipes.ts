import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from './i18n.service';

@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private i18nService: I18nService) {
  }

  transform(text: any, id?: string, replacements?: {[index:string]:string}, language?:string): string {
    const translateKey = id ? id : text;
    let translation = this.i18nService.getTranslation(translateKey);
    if(!translation) {
      //console.warn('Translation not found: ' + translateKey);
      translation = text;
    }
    return translation.replace(/\$\{([^\}]+)\}/g, (substring, ...args) => {
      return replacements ? (replacements[args[0]] || '') : '';
    });
  }
}
