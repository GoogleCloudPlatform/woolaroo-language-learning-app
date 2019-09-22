import { InjectionToken } from "@angular/core";
import { WordTranslation } from "./entities/translation";

export interface ITranslationService {
  translate(words:string[], maxTranslations:number):Promise<WordTranslation[]>;
}

export const TRANSLATION_SERVICE = new InjectionToken<ITranslationService>("Translation service");
export const TRANSLATION_SERVICE_CONFIG = new InjectionToken<any>("Translation service config");
