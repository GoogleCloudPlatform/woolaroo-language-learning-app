import { Injectable } from "@angular/core";
import { WordTranslation } from "./entities/translation";

@Injectable()
export class TranslationService {
  public async translate(words:string[], maxTranslations:number = 0):Promise<WordTranslation[]> {
    return words.map(w => { return { original: w, translation: w + ' tr' } });
  }
}
