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
    const promises: Promise<WordTranslation>[] = words.map(w => this.translateWord(w));
    return Promise.all(promises);
  }

  private translateWord(word: string): Promise<WordTranslation> {
    return new Promise((resolve, reject) => {
      return this.http.post<TranslationResponse>(this.config.endpointURL, word).subscribe({
        next: (response) => {
          resolve({ original: response.english_word, translation: response.translation, soundURL: response.sound_link });
        },
        error: (err) => {
          if (err.name === 'HttpErrorResponse') {
            // TODO: better way of detecting translation unavailable
            resolve({ original: word, translation: '', soundURL: '' });
          } else {
            reject(err);
          }
        }
      });
    });
  }
}
