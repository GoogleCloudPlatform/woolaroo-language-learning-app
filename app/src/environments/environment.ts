import { MockTranslationService } from 'services/mock/translation';
import { MockAnalyticsService } from 'services/mock/analytics';
import { MockImageRecognitionService } from 'services/mock/image-recognition';
import { MockFeedbackService } from 'services/mock/feedback';

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
      recordingBufferSize: 1024
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
