import { MockAnalyticsService } from 'services/mock/analytics';
import { APITranslationService } from 'services/api/translation';
import { LocalProfileService } from 'services/local-profile';
import { APIFeedbackService } from 'services/api/feedback';
import { SafeSearchLikelihood } from 'services/google/image-recognition';
import { APIImageRecognitionService } from 'services/api/image-recognition';

const baseEndpointUrl = 'https://us-central1-ggl-woolaroo-multilang-uat.cloudfunctions.net';
const debugImageUrl = '/assets/debug/IMG_20190920_141505.jpg';

export const environment = {
  production: false,
  assets: {
    baseUrl: '/',
  },
  i18n: {
    languages: [
      {
        code: 'en',
        name: 'English',
        file: './assets/locale/en.json',
        direction: 'ltr',
        default: true
      },
      {
        code: 'fr',
        name: 'Français',
        file: './assets/locale/fr.json',
        direction: 'ltr'
      },
      {
        code: 'es',
        name: 'Español',
        file: './assets/locale/es.json',
        direction: 'ltr'
      },
      {
        code: 'hi',
        name: 'हिन्दी',
        file: './assets/locale/hi.json',
        direction: 'ltr'
      },
      {
        code: 'ar',
        name: 'اَلْعَرَبِيَّةُ',
        file: './assets/locale/ar.json',
        direction: 'rtl'
      },
      {
        code: 'it',
        name: 'Italiano',
        file: './assets/locale/it.json',
        direction: 'ltr'
      },
      {
        code: 'pt',
        name: 'Português',
        file: './assets/locale/pt.json',
        direction: 'ltr'
      },
      {
        code: 'ru',
        name: 'русский',
        file: './assets/locale/ru.json',
        direction: 'ltr'
      },
      {
        code: 'zh',
        name: '普通话',
        file: './assets/locale/zh.json',
        direction: 'ltr'
      }
    ]
  },
  pages: {
    splash: {
      logosDuration: 4000,
      videoMaxStartTime: 3000,
      maxLogosDelay: 3000,
      showLogosVideoPosition: 0.5,
      partnerLogoUrl: '/assets/debug/partner-logo.png'
    },
    translate: {
      debugImageUrl,
      debugWords: ['technology', 'garbage', 'book']
    },
    termsAndPrivacy: {
      enabled: true,
      content: '<b>Terms and Privacy content</b><br /><a href="#">Here\'s a link</a>'
    },
    captionImage: {
      debugImageUrl
    },
    capture: {
      instructionsDuration: 5000
    }
  },
  components: {
    snackBar: {
      duration: 3000
    },
    cameraPreview: {
      resizeDelay: 1000
    },
    addWordFieldset: {
      maxRecordingDuration: 5000,
      recordingBufferSize: 4096,
      recordingMimeTypes: [ 'audio/mpeg', 'audio/wav', 'audio/webm' ],
      androidGBoardUrl: 'https://play.google.com/store/apps/details?id=com.google.android.inputmethod.latin',
      iosGBoardUrl: 'https://apps.apple.com/us/app/gboard-the-google-keyboard/id1091700242',
      keymanUrl: 'https://keyman.com/',
      progressAnimationInterval: 25
    },
    carousel: {
      animationInterval: 25,
      snapAcceleration: 10,
      snapMaxSpeed: 2,
      snapMinSpeed: 0.01,
      snapDecelerationDistance: 200,
      snapStickyDistance: 30,
      targetPositionRatio: 0.2,
      draggingMinDistance: 5
    },
    translationSelector: {
      scrollList: {
        animationInterval: 25,
        snapAcceleration: 10,
        snapMaxSpeed: 2,
        snapMinSpeed: 0.01,
        snapDecelerationDistance: 200,
        snapStickyDistance: 30,
        targetPositionRatio: 0.2,
        draggingMinDistance: 5
      },
      selectionLine: {
        animationInterval: 25,
        rotateSpeed: Math.PI * 2.0 * 0.7
      }
    }
  },
  services: {
    profile: {
      type: LocalProfileService,
      config: null
    },
    imageRecognition: {
      type: APIImageRecognitionService,
      config: {
        endpointURL: `${baseEndpointUrl}/visionAPI`,
        maxFileSize: 15 * 1024,
        validImageFormats: [ 'image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp' ],
        resizedImageDimension: 300,
        resizedImageQuality: 0.6,
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
    imageRendering: {
      config: {
        dropShadowDistance: 1,
        dropShadowColor: 'rgba(0, 0, 0, 0.5)',
        foregroundColor: 'white',
        transliteration: {
          font: '43px Roboto',
          lineHeight: 35,
          lineSpacing: 10,
          marginBottom: 25
        },
        translation: {
          font: '30px Roboto',
          lineHeight: 25,
          lineSpacing: 10,
          marginBottom: 25
        },
        originalWord: {
          font: '30px Roboto',
          lineHeight: 25,
          lineSpacing: 10,
          marginBottom: 85
        },
        line: { width: 1, height: 80, marginBottom: 20 },
        padding: 20
      }
    },
    endangeredLanguage: {
      config: {
        languages: [
          {
            code: 'scn',
            name: 'Sicilian',
            default: true
          },
          {
            code: 'yi',
            name: 'Yiddish'
          },
          {
            code: 'be',
            name: 'беларуская мова'
          },
          {
            code: 'zyg',
            name: '佒壯'
          }
        ]
      }
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
        addWordEndpointURL: `${baseEndpointUrl}/addSuggestions`,
        feedbackEndpointURL: `${baseEndpointUrl}/addFeedback`
      }
    }
  }
};
