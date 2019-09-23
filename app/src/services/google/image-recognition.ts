import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { InvalidFormatError, InappropriateContentError } from '../entities/errors';
import { IImageRecognitionService, IMAGE_RECOGNITION_CONFIG, ImageDescription } from "../image-recognition";
import { resizeImage } from 'util/image';

export enum SafeSearchLikelihood {
  VERY_UNLIKELY = "VERY_UNLIKELY",
  UNLIKELY = "UNLIKELY",
  POSSIBLE = "POSSIBLE",
  LIKELY = "LIKELY",
  VERY_LIKELY = "VERY_LIKELY"
}

export enum SafeSearchCategory {
  SPOOF = "spoof",
  MEDICAL = "medical",
  ADULT = "adult",
  VIOLENCE = "violence"
}

interface ImageRecognitionConfig {
  maxFileSize: number;
  validImageFormats: string[];
  resizedImageDimension: number,
  apiKey: string,
  maxResults: number,
  retryCount: number,
  singleWordDescriptionsOnly: boolean,
  maxSafeSearchLikelihoods:{[index:string]:SafeSearchLikelihood};
}

interface RecognitionAnnotation {
  description:string;
  score:number;
  topicality:number;
}

interface RecognitionResponseData {
  labelAnnotations:Array<RecognitionAnnotation>;
  safeSearchAnnotation:{[index:string]:SafeSearchLikelihood};
  error:{code:number,message:string};
}

interface RecognitionResponse {
  responses:Array<RecognitionResponseData>;
}

const VISION_URL:string = 'https://vision.googleapis.com/v1/images:annotate?key=';

@Injectable()
export class GoogleImageRecognitionService implements IImageRecognitionService {
  constructor(@Inject(IMAGE_RECOGNITION_CONFIG) private config: ImageRecognitionConfig,
              private http:HttpClient) {
  }

  public async loadDescriptions(imageData:Blob):Promise<ImageDescription[]> {
    if(this.config.validImageFormats.indexOf(imageData.type) < 0) {
      throw new InvalidFormatError('Image is not in supported format');
    }
    if(imageData.size > this.config.maxFileSize) {
      console.log('Image file size is too large - resizing: ' + imageData.size);
      imageData = await resizeImage(imageData, this.config.resizedImageDimension, this.config.resizedImageDimension);
    }
    return new Promise<ImageDescription[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageURL = reader.result as string;
        const imageDataBase64 = imageURL.split(',')[1]; // remove data scheme prefix
        this.loadImageDescriptions(imageDataBase64).then(resolve, reject);
      };
      reader.onerror = err => {
        console.warn('Error reading image data', err);
        reject(err);
      };
      reader.readAsDataURL(imageData);
    });
  }

  private loadImageDescriptions(imageBase64:string):Promise<ImageDescription[]> {
    return new Promise<ImageDescription[]>((resolve, reject) => {
      this.http.post<RecognitionResponse>( VISION_URL + this.config.apiKey, {
        requests: [ {
          image: { content: imageBase64 },
          features: [
            { type: 'LABEL_DETECTION', maxResults: this.config.maxResults },
            { type: 'SAFE_SEARCH_DETECTION' }
          ]
        } ]
      } )
      //.timeout(10000)
        .pipe( retry(this.config.retryCount) )
        .subscribe(response => {
            if(!response.responses) {
              console.warn("Empty response from Cloud Vision");
              resolve([]);
              return;
            }
            // check that image has at least one annotation
            const firstResponse = response.responses[0];
            if(firstResponse.error) {
              console.warn('Error loading image descriptions: ' + firstResponse.error);
              reject(new Error(firstResponse.error.message));
              return;
            }
            // check if image as flagged as inappropriate
            const maxLikelihoods = this.config.maxSafeSearchLikelihoods;
            for(const cat in maxLikelihoods) {
              if(firstResponse.safeSearchAnnotation[cat] && maxLikelihoods[cat]
                && GoogleImageRecognitionService.getSafeSearchLikelihoodIndex(firstResponse.safeSearchAnnotation[cat])
                > GoogleImageRecognitionService.getSafeSearchLikelihoodIndex(maxLikelihoods[cat])) {
                console.warn("Error loading image descriptions: image is inappropriate");
                reject(new InappropriateContentError("Image is inappropriate"));
                return;
              }
            }
            // check if image has no annotations
            if (!firstResponse || !firstResponse.labelAnnotations || firstResponse.labelAnnotations.length == 0) {
              console.warn("No Labels detected");
              reject(new Error("No Labels detected"));
              return;
            }
            // filter out any annotations with multiple words
            if (this.config.singleWordDescriptionsOnly) {
              firstResponse.labelAnnotations = firstResponse.labelAnnotations.filter( GoogleImageRecognitionService.isSingleWord );
            }
            resolve(firstResponse.labelAnnotations);
          },
          err => {
            console.warn("Error loading image descriptions: " + err);
            reject(err);
          });
    });
  }

  private static isSingleWord(value:RecognitionAnnotation) {
    return value.description.trim().split(' ').length == 1;
  }

  private static getSafeSearchLikelihoodIndex(likelihood:SafeSearchLikelihood):number {
    let index = 0;
    for(const i in SafeSearchLikelihood) {
      if(SafeSearchLikelihood[i] == likelihood) {
        return index;
      }
      index++;
    }
    return -1;
  }
}
