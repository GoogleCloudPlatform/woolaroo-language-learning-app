import { EventEmitter, Inject, Injectable, InjectionToken } from '@angular/core';

export interface EndangeredLanguage {
  code: string;
  name: string;
  default: boolean;
  apiURL: string;
  sampleWordImageURL: string;
  sampleWordTranslation: string;
  region: string;
  nativeSpeakers: string;
  description: string;
}

interface EndangeredLanguageConfig {
  languages: EndangeredLanguage[];
}

export const ENDANGERED_LANGUAGE_CONFIG = new InjectionToken<EndangeredLanguageConfig>('Endangered language config');

@Injectable()
export class EndangeredLanguageService {
  private _currentLanguage: EndangeredLanguage;
  public get currentLanguage(): EndangeredLanguage { return this._currentLanguage; }

  public readonly currentLanguageChanged:EventEmitter<string> = new EventEmitter();

  public get languages(): EndangeredLanguage[] { return this.config.languages; }

  constructor(@Inject(ENDANGERED_LANGUAGE_CONFIG) private config: EndangeredLanguageConfig) {
    let defaultLanguage = this.config.languages.find(lang => lang.default);
    this._currentLanguage = defaultLanguage || this.config.languages[0];
  }

  public setLanguage(code: string) {
    if(code == this._currentLanguage.code) {
      return;
    }
    const newLanguage = this.config.languages.find(lang => lang.code === code);
    if(!newLanguage) {
      throw new Error("Language not found: " + code);
    }
    console.log("Endangered language changed: " + code);
    this._currentLanguage = newLanguage;
    this.currentLanguageChanged.emit(this._currentLanguage.code);
  }
}
