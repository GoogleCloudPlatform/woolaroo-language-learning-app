import { Injectable } from '@angular/core';
import { IImageRecognitionService, ImageDescription } from '../image-recognition';

@Injectable()
export class MockImageRecognitionService implements IImageRecognitionService {
  public async loadDescriptions(imageData: Blob): Promise<ImageDescription[]> {
    return [
      { description: 'blue', score: 0.9 },
      { description: 'daytime', score: 0.8 },
      { description: 'cloud', score: 0.8 }
    ];
  }
}
