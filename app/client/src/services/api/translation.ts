import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WordTranslation } from '../entities/translation';
import { ITranslationService, TRANSLATION_CONFIG } from '../translation';

interface APITranslationConfig {
  endpointURL: string;
}

interface TranslationResponse {
  english_word: string;
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
    return words.every(w => translations.find(tr => tr.original === w));
  }

  public async translate(words: string[], maxTranslations: number = 0): Promise<WordTranslation[]> {
    const lowercaseWords = words.map((w) => w.toLowerCase());
    if (this.lastTranslations && APITranslationService.wordTranslationsAreEqual(lowercaseWords, this.lastTranslations)) {
      // use cached results
      return Promise.resolve(this.lastTranslations);
    }
    const response = await this.http.post<TranslationResponse[]>(this.config.endpointURL, { english_words: lowercaseWords }).toPromise();
    const translations = response.filter(tr => tr.translation).map(tr => ({
      original: tr.english_word,
      translation: tr.translation,
      transliteration: tr.transliteration,
      soundURL: tr.sound_link
    }));
    lowercaseWords.forEach((w) => {
      if (!translations.find((tr) => tr.original === w)) {
        translations.push({ original: w, translation: '', transliteration: '', soundURL: '' });
      }
    });
    // cache results
    this.lastTranslations = translations;
    return translations;
  }
}
