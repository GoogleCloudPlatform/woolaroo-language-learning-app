import { Injectable } from '@angular/core';
import { IImageRecognitionService, ImageDescription } from '../image-recognition';

@Injectable()
export class MockImageRecognitionService implements IImageRecognitionService {
  public async loadDescriptions(imageData: Blob): Promise<ImageDescription[]> {
    return [
      { description: 'keyboard', score: 0.9 },
      { description: 'bed', score: 0.8 },
      { description: 'book', score: 0.8 }
    ];
  }
}
