import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

export type LanguageDirection = 'ltr'|'rtl';

interface LanguageData {
  code: string;
  name: string;
  file: string;
  direction: LanguageDirection;
}


@Injectable()
export class I18nService {
  private _currentLanguage: LanguageData;
  private _translations:{[key:string]:string};

  public readonly languageChanged:EventEmitter<string> = new EventEmitter();
  public get languageDirection():LanguageDirection { return this._currentLanguage.direction; }

  constructor(private http: HttpClient) {
    this._translations = {};
    this._currentLanguage = { code: environment.i18n.defaultLanguage, name: '', direction: 'ltr', file: '' };
    this.setLanguage(environment.i18n.defaultLanguage);
  }

  async setLanguage(language: string) {
    const newLanguage = (environment.i18n.languages as LanguageData[]).find(lang => lang.code == language);
    if(!newLanguage) {
      throw new Error("Language not found: " + language);
    }
    this._currentLanguage = newLanguage;
    try {
      this._translations = await this.http.get<{[key: string]:string}>(newLanguage.file).toPromise();
    } catch(err) {
      console.warn('Error loading translation file', err);
      this._translations = {};
    }
    this.languageChanged.emit(language);
  }

  getTranslation(key: string) {
    return this._translations[key];
  }
}
