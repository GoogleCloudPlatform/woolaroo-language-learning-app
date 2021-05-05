import { EventEmitter, Inject, Injectable, InjectionToken } from '@angular/core';
import {getLogger} from 'util/logging';

const logger = getLogger('EndangeredLanguageService');

export interface EndangeredLanguage {
  code: string;
  name: string;
  default: boolean;
  apiURL: string;
  organizationName: string;
  organizationURL: string;
  sampleWordImageURL: string;
  sampleWordTranslation: string;
  nativeSpeakers: string;
}

interface EndangeredLanguageConfig {
  languages: EndangeredLanguage[];
}

export const ENDANGERED_LANGUAGE_CONFIG = new InjectionToken<EndangeredLanguageConfig>('Endangered language config');

@Injectable()
export class EndangeredLanguageService {
  private _currentLanguage: EndangeredLanguage;
  public get currentLanguage(): EndangeredLanguage { return this._currentLanguage; }

  public readonly currentLanguageChanged: EventEmitter<string> = new EventEmitter();

  public get languages(): EndangeredLanguage[] { return this.config.languages; }

  constructor(
    @Inject(ENDANGERED_LANGUAGE_CONFIG) private config: EndangeredLanguageConfig) {
    const defaultLanguage = this.config.languages.find(lang => lang.default);
    this._currentLanguage = defaultLanguage || this.config.languages[0];
  }

  public setLanguage(code: string) {
    if (code === this._currentLanguage.code) {
      return;
    }
    const newLanguage = this.config.languages.find(lang => lang.code === code);
    if (!newLanguage) {
      throw new Error('Language not found: ' + code);
    }
    logger.log('Endangered language changed: ' + code);
    this._currentLanguage = newLanguage;
    this.currentLanguageChanged.emit(this._currentLanguage.code);
  }
}
