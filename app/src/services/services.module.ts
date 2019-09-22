import { NgModule } from '@angular/core';
import { ImageTranslationService } from "./image-translation";
import { IMAGE_RECOGNITION_SERVICE, IMAGE_RECOGNITION_CONFIG } from "./image-recognition";
import { TRANSLATION_SERVICE, TRANSLATION_SERVICE_CONFIG } from "./translation";
import { environment } from "environments/environment";

@NgModule({
  declarations: [
  ],
  providers: [
    ImageTranslationService,
    { provide: IMAGE_RECOGNITION_SERVICE, useClass: environment.services.imageRecognition.type },
    { provide: IMAGE_RECOGNITION_CONFIG, useValue: environment.services.imageRecognition.config },
    { provide: TRANSLATION_SERVICE, useClass: environment.services.translation.type },
    { provide: TRANSLATION_SERVICE_CONFIG, useValue: environment.services.translation.config },
  ]
})
export class ServicesModule {}
