import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IFeedbackService, FEEDBACK_CONFIG } from 'services/feedback';
import { AddedWord, Feedback } from 'services/entities/feedback';

interface APIFeedbackConfig {
  addWordAudioEndpointURL: string;
  addWordEndpointURL: string;
}

@Injectable()
export class APIFeedbackService implements IFeedbackService {
  public constructor(private http: HttpClient, @Inject(FEEDBACK_CONFIG) private config: APIFeedbackConfig) {
  }

  public async sendFeedback(feedback: Feedback): Promise<any> {
    return Promise.reject(new Error('Not implemented'));
  }

  public async addWord(word: AddedWord): Promise<any> {
    let soundUrl: string|null = null;
    if (word.recording) {
      console.log('Sending audio');
      soundUrl = await this.http.post<string>(this.config.addWordAudioEndpointURL, word.recording).toPromise();
    }
    console.log('Adding word');
    const requestBody = {
      english_word: word.englishWord,
      translation: word.nativeWord,
      transliteration: word.transliteration,
      sound_link: soundUrl
    };
    await this.http.post(this.config.addWordEndpointURL, requestBody).toPromise();
    console.log('Word added');
  }
}
