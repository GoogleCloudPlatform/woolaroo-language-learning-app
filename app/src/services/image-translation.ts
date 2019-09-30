import {Inject, Injectable} from '@angular/core';
import { WordTranslation } from './entities/translation';
import { IImageRecognitionService, IMAGE_RECOGNITION_SERVICE } from './image-recognition';
import { ITranslationService, TRANSLATION_SERVICE } from './translation';

@Injectable()
export class ImageTranslationService {
  constructor(@Inject(IMAGE_RECOGNITION_SERVICE) private imageRecognitionService: IImageRecognitionService,
              @Inject(TRANSLATION_SERVICE) private translationService: ITranslationService) {
  }

  public async loadTranslatedDescriptions(imageData: Blob, maxTranslations: number = 0): Promise<WordTranslation[]> {
    const descriptions = await this.imageRecognitionService.loadDescriptions(imageData);
    return await this.translationService.translate(descriptions.map(d => d.description), maxTranslations);
  }
}
