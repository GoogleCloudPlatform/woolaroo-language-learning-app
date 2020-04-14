import { GoogleAnalyticsService } from 'services/google/analytics';
import { SafeSearchLikelihood } from 'services/google/image-recognition';
import { APITranslationService } from 'services/api/translation';
import { LocalProfileService } from 'services/local-profile';
import { APIFeedbackService } from 'services/api/feedback';
import { params } from './environment.prod.params';
import { APIImageRecognitionService } from 'services/api/image-recognition';

export const environment = {
  production: true,
  assets: {
    baseUrl: params.assetsBaseUrl,
  },
  i18n: {
    defaultLanguage: 'en',
    languages: [
      {
        code: 'en',
        name: 'English',
        file: params.assetsBaseUrl + 'assets/locale/en.json',
        direction: 'ltr'
      },
      {
        code: 'fr',
        name: 'Français',
        file: params.assetsBaseUrl + 'assets/locale/fr.json',
        direction: 'ltr'
      },
      {
        code: 'es',
        name: 'Español',
        file: params.assetsBaseUrl + 'assets/locale/es.json',
        direction: 'ltr'
      },
      {
        code: 'hi',
        name: 'हिन्दी',
        file: params.assetsBaseUrl + 'assets/locale/hi.json',
        direction: 'ltr'
      },
      {
        code: 'ar',
        name: 'اَلْعَرَبِيَّةُ',
        file: params.assetsBaseUrl + 'assets/locale/ar.json',
        direction: 'rtl'
      },
      {
        code: 'it',
        name: 'Italiano',
        file: params.assetsBaseUrl + 'assets/locale/it.json',
        direction: 'ltr'
      },
      {
        code: 'pt',
        name: 'Português',
        file: params.assetsBaseUrl + 'assets/locale/pt.json',
        direction: 'ltr'
      }
    ]
  },
  endangeredLanguage: params.endangeredLanguage,
  pages: {
    splash: {
      logosDuration: 4000,
      videoMaxStartTime: 3000,
      maxLogosDelay: 3000,
      showLogosVideoPosition: 0.5,
      partnerLogoUrl: params.partnerLogoUrl
    },
    translate: {
    },
    captionImage: {
    },
    termsAndPrivacy: {
      enabled: params.termsAndPrivacyEnabled,
      content: params.termsAndPrivacyContent
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
        endpointURL: `${params.apiUrl}/visionAPI`,
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
    translation: {
      type: APITranslationService,
      config: {
        endpointURL: `${params.apiUrl}/getTranslations`
      }
    },
    analytics: {
      type: GoogleAnalyticsService,
      config: {
        trackerID: params.googleTrackerId
      }
    },
    feedback: {
      type: APIFeedbackService,
      config: {
        addWordAudioEndpointURL: `${params.apiUrl}/saveAudioSuggestions`,
        addWordEndpointURL: `${params.apiUrl}/addSuggestions`,
        feedbackEndpointURL: `${params.apiUrl}/addFeedback`
      }
    }
  }
};
