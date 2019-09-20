import { Injectable } from "@angular/core";
import { WordTranslation } from "./entities/translation";
import { ImageRecognitionService } from "./image-recognition";
import { TranslationService } from "./translation";

@Injectable()
export class ImageTranslationService {
  constructor(private imageRecognitionService:ImageRecognitionService, private translationService:TranslationService) {
  }

  public async loadTranslatedDescriptions(imageData:Blob, maxTranslations:number = 0):Promise<WordTranslation[]> {
    const descriptions = await this.imageRecognitionService.loadDescriptions(imageData);
    return await this.translationService.translate(descriptions.map(d => d.description), maxTranslations);
  }
}
