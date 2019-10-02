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
  public constructor(private http: HttpClient, @Inject(TRANSLATION_CONFIG) private config: APITranslationConfig) {
  }

  public translate(words: string[], maxTranslations: number = 0): Promise<WordTranslation[]> {
    console.log(words);
    return new Promise((resolve, reject) => {
      return this.http.post<TranslationResponse[]>(this.config.endpointURL, { english_words: words }).subscribe({
        next: (response) => {
          const translations = response.filter(tr => tr.translation).map(tr => ({
            original: tr.english_word,
            translation: tr.translation,
            transliteration: tr.transliteration,
            soundURL: tr.sound_link
          }));
          resolve(translations);
        },
        error: reject
      });
    });
  }
}
