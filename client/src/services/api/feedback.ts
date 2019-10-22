import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IFeedbackService, FEEDBACK_CONFIG } from 'services/feedback';
import { AddedWord, Feedback } from 'services/entities/feedback';

interface APIFeedbackConfig {
  addWordAudioEndpointURL: string;
  addWordEndpointURL: string;
  feedbackEndpointURL: string;
}

@Injectable()
export class APIFeedbackService implements IFeedbackService {
  public constructor(private http: HttpClient, @Inject(FEEDBACK_CONFIG) private config: APIFeedbackConfig) {
  }

  public async sendFeedback(feedback: Feedback): Promise<any> {
    console.log('Sending feedback');
    const requestBody = {
      english_word: feedback.word ? feedback.word.original : null,
      translation: feedback.word ? feedback.word.translation : null,
      transliteration: feedback.word ? feedback.word.transliteration : null,
      types: feedback.types,
      content: feedback.content
    };
    await this.http.post(this.config.feedbackEndpointURL, requestBody, { responseType: 'text' }).toPromise();
    console.log('Feedback sent');
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
