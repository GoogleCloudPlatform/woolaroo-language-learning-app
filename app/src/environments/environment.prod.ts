import { mergeConfigurations } from "util/config";
import { environment as baseEnvironment } from './environment.base';
import { MockTranslationService } from "services/mock/translation";
import { MockFeedbackService } from "services/mock/feedback";
import { GoogleAnalyticsService } from "services/google/analytics";

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
    },
    analytics: {
      type: GoogleAnalyticsService,
      config: {
        trackerID: '<GOOGLE_TRACKER_ID>'
      }
    },
    feedback: {
      type: MockFeedbackService
    }
  }
});
