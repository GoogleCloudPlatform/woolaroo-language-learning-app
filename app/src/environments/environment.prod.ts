import { MockTranslationService } from 'services/mock/translation';
import { MockFeedbackService } from 'services/mock/feedback';
import { GoogleAnalyticsService } from 'services/google/analytics';
import { GoogleImageRecognitionService, SafeSearchLikelihood } from 'services/google/image-recognition';

export const environment = {
  production: true,
  splash: {
    duration: 3000,
  },
  capture: {
    resizeDelay: 1000
  },
  translate: {
    debugImageUrl: null
  },
  services: {
    imageRecognition: {
      type: GoogleImageRecognitionService,
      config: {
        apiKey: '<GOOGLE_API_KEY>',
        maxFileSize: 2 * 1024 * 1024,
        validImageFormats: [ 'image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp' ],
        resizedImageDimension: 1000,
        maxResults: 10,
        retryCount: 3,
        singleWordDescriptionsOnly: true,
        maxSafeSearchLikelihoods: {
          spoof: SafeSearchLikelihood.VERY_LIKELY,
          medical: SafeSearchLikelihood.POSSIBLE,
          adult: SafeSearchLikelihood.POSSIBLE,
          violence: SafeSearchLikelihood.POSSIBLE,
        }
      }
    },
    translation: {
      type: MockTranslationService,
      config: null
    },
    analytics: {
      type: GoogleAnalyticsService,
      config: {
        trackerID: '<GOOGLE_TRACKER_ID>'
      }
    },
    feedback: {
      type: MockFeedbackService,
      config: null
    }
  }
};
