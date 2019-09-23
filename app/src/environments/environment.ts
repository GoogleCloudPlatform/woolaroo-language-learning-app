import { mergeConfigurations } from "util/config";
import { environment as baseEnvironment } from './environment.base';
import { MockTranslationService } from "services/mock/translation";
import { MockAnalyticsService } from "services/mock/analytics";
import { MockImageRecognitionService } from "services/mock/image-recognition";
import { MockFeedbackService } from "services/mock/feedback";

export const environment =  mergeConfigurations(baseEnvironment, {
  production: false,
  services: {
    imageRecognition: {
      type: MockImageRecognitionService
    },
    translation: {
      type: MockTranslationService
    },
    analytics: {
      type: MockAnalyticsService
    },
    feedback: {
      type: MockFeedbackService
    }
  }
});
