import { ImageDescription } from '../entities/image-description';
import { IImageRecognitionService } from "../image-recognition";

export class MockImageRecognitionService implements IImageRecognitionService{
  public loadDescriptions(imageData:Blob):Promise<ImageDescription[]> {
    return Promise.resolve([
      { "description": "Computer", "score": 0.9 },
      { "description": "Office", "score": 0.8 },
      { "description": "Chair", "score": 0.8 }
    ]);
  }
}
