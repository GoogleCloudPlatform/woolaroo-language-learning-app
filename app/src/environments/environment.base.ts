import { SafeSearchLikelihood } from "services/entities/safe-search";
import { GoogleImageRecognitionService } from "services/google/image-recognition";

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
      type: GoogleImageRecognitionService,
      config: {
        maxFileSize: 2 * 1024 * 1024,
        validImageFormats: [ 'image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp' ],
        resizedImageDimension: 1000,
        apiKey: '',
        maxResults: 10,
        retryCount: 3,
        singleWordDescriptionsOnly: true,
        maxSafeSearchLikelihoods: {
          "spoof": SafeSearchLikelihood.VERY_LIKELY,
          "medical": SafeSearchLikelihood.POSSIBLE,
          "adult": SafeSearchLikelihood.POSSIBLE,
          "violence": SafeSearchLikelihood.POSSIBLE,
        }
      }
    },
    translation: {
      type: null
    }
  }
};
