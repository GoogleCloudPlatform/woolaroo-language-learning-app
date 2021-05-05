import { InjectionToken } from '@angular/core';

export interface ImageDescription {
  description: string;
  score: number;
}

export interface IImageRecognitionService {
  loadDescriptions(imageData: Blob): Promise<ImageDescription[]>;
}

export const IMAGE_RECOGNITION_SERVICE = new InjectionToken<IImageRecognitionService>('Image recognition service');
export const IMAGE_RECOGNITION_CONFIG = new InjectionToken<any>('Image recognition config');
