import { MockFeedbackService } from 'services/mock/feedback';
import { GoogleAnalyticsService } from 'services/google/analytics';
import { GoogleImageRecognitionService, SafeSearchLikelihood } from 'services/google/image-recognition';
import { APITranslationService } from 'services/api/translation';

export const environment = {
  production: true,
  capture: {
    resizeDelay: 1000
  },
  translate: {
    debugImageUrl: null
  },
  pages: {
    splash: {
      duration: 3000
    },
    addWord: {
      maxRecordingDuration: 5000,
      recordingBufferSize: 4096,
      recordingMimeTypes: [ 'audio/webm', 'audio/mpeg', 'audio/wav' ],
      androidGBoardUrl: 'https://play.google.com/store/apps/details?id=com.google.android.inputmethod.latin',
      iosGBoardUrl: 'https://apps.apple.com/us/app/gboard-the-google-keyboard/id1091700242',
      keymanUrl: 'https://keyman.com/',
      progressAnimationInterval: 25
    }
  },
  components: {
    translationSelector: {
      scrollList: {
        animationInterval: 25,
        snapAcceleration: 10,
        snapMaxSpeed: 2,
        snapMinSpeed: 0.01,
        snapDecelerationDistance: 200,
        snapStickyDistance: 30,
        targetPositionRatio: 0.2
      },
      selectionLine: {
        animationInterval: 25,
        rotateSpeed: Math.PI * 2.0 * 0.7
      }
    }
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
