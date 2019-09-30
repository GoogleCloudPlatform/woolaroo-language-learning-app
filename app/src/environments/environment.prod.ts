import { MockFeedbackService } from 'services/mock/feedback';
import { GoogleAnalyticsService } from 'services/google/analytics';
import { GoogleImageRecognitionService, SafeSearchLikelihood } from 'services/google/image-recognition';
import { APITranslationService } from 'services/api/translation';

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
      type: APITranslationService,
      config: {
        endpointURL: 'https://us-central1-barnard-project.cloudfunctions.net/getTranslations'
      }
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
