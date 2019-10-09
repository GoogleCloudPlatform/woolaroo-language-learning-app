import { MockAnalyticsService } from 'services/mock/analytics';
import { MockImageRecognitionService } from 'services/mock/image-recognition';
import { APITranslationService } from 'services/api/translation';
import { APIFeedbackService } from 'services/api/feedback';

const baseEndpointUrl = 'https://us-central1-barnard-project.cloudfunctions.net';

export const environment = {
  production: false,
  splash: {
    duration: 3000,
  },
  capture: {
    resizeDelay: 1000
  },
  translate: {
    debugImageUrl: '/assets/debug/IMG_20190920_141505.jpg'
  },
  pages: {
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
      type: MockImageRecognitionService,
      config: null
    },
    translation: {
      type: APITranslationService,
      config: {
        endpointURL: `${baseEndpointUrl}/getTranslations`
      }
    },
    analytics: {
      type: MockAnalyticsService,
      config: null
    },
    feedback: {
      type: APIFeedbackService,
      config: {
        addWordAudioEndpointURL: `${baseEndpointUrl}/saveAudioSuggestions`,
        addWordEndpointURL: `${baseEndpointUrl}/addSuggestions`
      }
    }
  }
};
