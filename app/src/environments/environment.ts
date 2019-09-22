import { mergeConfigurations } from "util/config";
import { environment as baseEnvironment } from './environment.base';
import { MockTranslationService } from "services/mock/translation";

export const environment =  mergeConfigurations(baseEnvironment, {
  production: false,
  services: {
    imageRecognition: {
      config: {
        apiKey: 'AIzaSyBrfr9K930Is8e5SvNPlAVMxa0UNdiegdY'
      }
    },
    translation: {
      type: MockTranslationService
    }
  }
});
