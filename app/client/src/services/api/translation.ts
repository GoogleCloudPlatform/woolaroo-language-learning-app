import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WordTranslation } from '../entities/translation';
import { ITranslationService, TRANSLATION_CONFIG } from '../translation';

interface APITranslationConfig {
  endpointURL: string;
}

interface TranslationResponse {
  english_word: string;
  primary_word: string;
  transliteration: string;
  sound_link: string;
  translation: string;
}

@Injectable()
export class APITranslationService implements ITranslationService {
  private lastTranslations: WordTranslation[]|null = null;

  public constructor(private http: HttpClient, @Inject(TRANSLATION_CONFIG) private config: APITranslationConfig) {
  }

  private static wordTranslationsAreEqual(words: string[], translations: WordTranslation[]): boolean {
    if (words.length !== translations.length) {
      return false;
    }
    return words.every(w => !!translations.find(tr =>  tr.original === w));
  }

  private static formatSoundURL(url:string|null):string|null {
    if(!url) {
      return url;
    }
    if(url.indexOf('?') >= 0) {
      return `${url}&ngsw-bypass`;
    } else {
      return `${url}?ngsw-bypass`;
    }
  }

  public async translate(englishWords: string[], maxTranslations: number = 0): Promise<WordTranslation[]> {
    const lowercaseWords = englishWords.map((w) => w.toLowerCase());
    if (this.lastTranslations && APITranslationService.wordTranslationsAreEqual(lowercaseWords, this.lastTranslations)) {
      // use cached results
      return Promise.resolve(this.lastTranslations);
    }
    const response = await this.http.post<TranslationResponse[]>(this.config.endpointURL, { english_words: lowercaseWords }).toPromise();
    let translations = response.map(tr => ({
      english: tr.english_word,
      original: tr.primary_word,
      translation: tr.translation,
      transliteration: tr.transliteration,
      soundURL: APITranslationService.formatSoundURL(tr.sound_link)
    }));
    // add any missing translations
    lowercaseWords.forEach((w) => {
      if (!translations.find((tr) => tr.english === w)) {
        translations.push({ original: '', english: w, translation: '', transliteration: '', soundURL: '' });
      }
    });
    // filter out empty translations
    translations = translations.filter(tr => tr.english);
    // cache results
    this.lastTranslations = translations;
    return translations;
  }
}
