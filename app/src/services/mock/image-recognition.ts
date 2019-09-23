import { Injectable } from "@angular/core";
import { ImageDescription } from '../entities/image-description';
import { IImageRecognitionService } from "../image-recognition";

@Injectable()
export class MockImageRecognitionService implements IImageRecognitionService {
  public async loadDescriptions(imageData:Blob):Promise<ImageDescription[]> {
    return [
      { "description": "Computer", "score": 0.9 },
      { "description": "Office", "score": 0.8 },
      { "description": "Chair", "score": 0.8 }
    ];
  }
}
