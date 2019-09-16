import {SafeSearchLikelihood} from "../services/entities/safe-search";

export const environment = {
  production: true,
  capture: {
    resizeDelay: 1000
  },
  google: {
    vision: {
      maxFileSize: 2 * 1024 * 1024,
      validImageFormats: [ 'image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp' ],
      resizedImageDimension: 1000,
      apiKey: 'AIzaSyBrfr9K930Is8e5SvNPlAVMxa0UNdiegdY',
      maxResults: 10,
      singleWordDescriptionsOnly: true,
      maxSafeSearchLikelihoods: {
        "spoof": SafeSearchLikelihood.VERY_LIKELY,
        "medical": SafeSearchLikelihood.POSSIBLE,
        "adult": SafeSearchLikelihood.POSSIBLE,
        "violence": SafeSearchLikelihood.POSSIBLE,
      }
    }
  }
};
