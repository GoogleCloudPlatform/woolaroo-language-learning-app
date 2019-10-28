import { Inject, Injectable } from '@angular/core';
import { IMAGE_RECOGNITION_CONFIG } from 'services/image-recognition';
import { HttpClient } from '@angular/common/http';
import { GoogleImageRecognitionServiceBase, GoogleImageRecognitionConfigBase } from 'services/google/image-recognition';

interface APIImageRecognitionConfig extends GoogleImageRecognitionConfigBase {
  endpointURL: string;
}

@Injectable()
export class APIImageRecognitionService extends GoogleImageRecognitionServiceBase {
  private apiConfig: APIImageRecognitionConfig;

  protected get endpointUrl(): string { return this.apiConfig.endpointURL; }

  constructor(@Inject(IMAGE_RECOGNITION_CONFIG) config: APIImageRecognitionConfig, http: HttpClient) {
    super(config, http);
    this.apiConfig = config;
  }
}
