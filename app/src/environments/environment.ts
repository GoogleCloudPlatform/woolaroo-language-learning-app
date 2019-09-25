import { MockTranslationService } from 'services/mock/translation';
import { MockAnalyticsService } from 'services/mock/analytics';
import { MockImageRecognitionService } from 'services/mock/image-recognition';
import { MockFeedbackService } from 'services/mock/feedback';

export const environment = {
  production: false,
  capture: {
    resizeDelay: 1000
  },
  translate: {
    debugImageUrl: null
  },
  services: {
    imageRecognition: {
      type: MockImageRecognitionService,
      config: null
    },
    translation: {
      type: MockTranslationService,
      config: null
    },
    analytics: {
      type: MockAnalyticsService,
      config: null
    },
    feedback: {
      type: MockFeedbackService,
      config: null
    }
  }
};
