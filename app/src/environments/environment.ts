import { mergeConfigurations } from "util/config";
import { environment as baseEnvironment } from './environment.base';
import { MockTranslationService } from "services/mock/translation";
import { MockAnalyticsService } from "services/mock/analytics";

export const environment =  mergeConfigurations(baseEnvironment, {
  production: false,
  services: {
    imageRecognition: {
      config: {
        apiKey: '<GOOGLE_API_KEY>'
      }
    },
    translation: {
      type: MockTranslationService
    },
    analytics: {
      type: MockAnalyticsService
    }
  }
});
