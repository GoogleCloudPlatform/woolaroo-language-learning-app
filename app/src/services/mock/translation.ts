import { Injectable } from '@angular/core';
import { WordTranslation } from '../entities/translation';
import { ITranslationService } from '../translation';

@Injectable()
export class MockTranslationService implements ITranslationService {
  public async translate(words: string[], maxTranslations: number = 0): Promise<WordTranslation[]> {
    return words.map(w => ({ original: w, translation: w + ' translation', soundURL: null }));
  }
}
