import { Injectable } from '@angular/core';
import { WordTranslation } from '../entities/translation';
import { ITranslationService } from '../translation';

@Injectable()
export class MockTranslationService implements ITranslationService {
  public async translate(words: string[], maxTranslations: number = 0): Promise<WordTranslation[]> {
    return words.map((w, index) =>({
      original: w,
      translation: 'te ra',
      transliteration: '白天',
      soundURL: index % 2 === 0 ? '/assets/debug/translation.mp3' : null
    }));
  }
}
