import { NgModule } from '@angular/core';
import { IMAGE_RECOGNITION_SERVICE, IMAGE_RECOGNITION_CONFIG } from './image-recognition';
import { TRANSLATION_SERVICE, TRANSLATION_CONFIG } from './translation';
import { ANALYTICS_SERVICE, ANALYTICS_CONFIG} from './analytics';
import { FEEDBACK_SERVICE, FEEDBACK_CONFIG} from './feedback';
import { PROFILE_SERVICE, PROFILE_CONFIG} from './profile';
import { environment } from 'environments/environment';
import { SessionService } from 'services/session';
import { ImageRenderingService, IMAGE_RENDERING_CONFIG } from 'services/image-rendering';
import { EndangeredLanguageService, ENDANGERED_LANGUAGE_CONFIG } from './endangered-language';

@NgModule({
  declarations: [
  ],
  providers: [
    SessionService,
    ImageRenderingService,
    { provide: IMAGE_RENDERING_CONFIG, useValue: environment.services.imageRendering.config },
    EndangeredLanguageService,
    { provide: ENDANGERED_LANGUAGE_CONFIG, useValue: environment.services.endangeredLanguage.config },
    { provide: IMAGE_RECOGNITION_SERVICE, useClass: environment.services.imageRecognition.type },
    { provide: IMAGE_RECOGNITION_CONFIG, useValue: environment.services.imageRecognition.config },
    { provide: TRANSLATION_SERVICE, useClass: environment.services.translation.type },
    { provide: TRANSLATION_CONFIG, useValue: environment.services.translation.config },
    { provide: ANALYTICS_SERVICE, useClass: environment.services.analytics.type },
    { provide: ANALYTICS_CONFIG, useValue: environment.services.analytics.config },
    { provide: FEEDBACK_SERVICE, useClass: environment.services.feedback.type },
    { provide: FEEDBACK_CONFIG, useValue: environment.services.feedback.config },
    { provide: PROFILE_SERVICE, useClass: environment.services.profile.type },
    { provide: PROFILE_CONFIG, useValue: environment.services.profile.config },
  ]
})
export class ServicesModule {}
