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

interface TranslateRequest {
  words: string[];
  primaryLanguage: string;
  targetLanguage: string;
}

@Injectable()
export class APITranslationService implements ITranslationService {
  private lastRequest: TranslateRequest|null = null;
  private lastResponse: WordTranslation[]|null = null;

  public constructor(private http: HttpClient, @Inject(TRANSLATION_CONFIG) private config: APITranslationConfig) {
  }

  private static requestsAreEqual(request1: TranslateRequest, request2: TranslateRequest): boolean {
    if (request1.primaryLanguage !== request2.primaryLanguage || request1.targetLanguage !== request2.targetLanguage) {
      return false;
    }
    if (request1.words.length !== request2.words.length) {
      return false;
    }
    return request1.words.every(w => request2.words.indexOf(w) >= 0);
  }

  private static formatSoundURL(url: string|null): string|null {
    if (!url) {
      return url;
    }
    if (url.indexOf('?') >= 0) {
      return `${url}&ngsw-bypass`;
    } else {
      return `${url}?ngsw-bypass`;
    }
  }

  public async translate(englishWords: string[], primaryLanguage: string, targetLanguage: string,
                         maxTranslations: number = 0): Promise<WordTranslation[]> {
    const lowercaseWords = englishWords.map((w) => w.toLowerCase());
    const newRequest: TranslateRequest = { words: lowercaseWords, primaryLanguage, targetLanguage };
    if (this.lastRequest && this.lastResponse && APITranslationService.requestsAreEqual(this.lastRequest, newRequest)) {
      // use cached results
      return Promise.resolve(this.lastResponse);
    }
    const response = await this.http.post<TranslationResponse[]>(this.config.endpointURL, {
      english_words: lowercaseWords,
      primary_language: primaryLanguage,
      target_language: targetLanguage
    }).toPromise();
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
    this.lastRequest = newRequest;
    this.lastResponse = translations;
    return translations;
  }
}
