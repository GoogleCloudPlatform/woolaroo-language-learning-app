import { Injectable } from '@angular/core';
import { IFeedbackService } from '../feedback';
import { Feedback, AddedWord } from '../entities/feedback';

@Injectable()
export class MockFeedbackService implements IFeedbackService {
  public sendFeedback(feedback: Feedback): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Submitted feedback: ' + feedback.content);
        resolve();
      }, 2000);
    });
  }

  public addWord(word: AddedWord): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Added word: ' + word.englishWord);
        resolve();
      }, 2000);
    });
  }
}
