import { Injectable } from '@angular/core';
import { IFeedbackService } from '../feedback';
import { Feedback } from '../entities/feedback';

@Injectable()
export class MockFeedbackService implements IFeedbackService {
  public async sendFeedback(feedback: Feedback): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Submitted feedback: ' + feedback.content);
        resolve();
      }, 2000);
    });
  }
}
