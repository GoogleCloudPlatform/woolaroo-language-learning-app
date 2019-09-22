import { mergeConfigurations } from "util/config";
import { environment as baseEnvironment } from './environment.base';
import { MockTranslationService } from "services/mock/translation";

export const environment =  mergeConfigurations(baseEnvironment, {
  production: true,
  services: {
    imageRecognition: {
      config: {
        apiKey: '<GOOGLE_API_KEY>'
      }
    },
    translation: {
      type: MockTranslationService
    }
  }
});
