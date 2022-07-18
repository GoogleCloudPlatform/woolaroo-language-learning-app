import { Injectable } from '@angular/core';
import { WordTranslation } from '../entities/translation';
import { ITranslationService } from '../translation';

@Injectable()
export class MockTranslationService implements ITranslationService {
  public async translate(words: string[], primaryLanguage: string, targetLanguage: string, maxTranslations: number = 0): Promise<WordTranslation[]> {
    return words.map((w, index) => ({
      original: w,
      english: w + ' en',
      translation: index > 0 ? w + ' tr' : '白天',
      transliteration: '白天',
      soundURL: index > 1 ? '/assets/debug/translation.mp3?v=1' : null
    }));
  }
}
