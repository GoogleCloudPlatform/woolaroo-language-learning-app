import {AfterViewInit, Component, Inject} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {MatCheckboxChange, MatDialog} from '@angular/material';
import {ANALYTICS_SERVICE, IAnalyticsService} from 'services/analytics';
import {FEEDBACK_SERVICE, IFeedbackService} from 'services/feedback';
import {FeedbackType} from 'services/entities/feedback';
import {LoadingPopUpComponent} from 'components/loading-popup/loading-popup';

@Component({
  selector: 'app-page-feedback',
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.scss']
})
export class FeedbackPageComponent implements AfterViewInit {
  public submittingForm = false;
  public FeedbackType = FeedbackType;
  public feedbackTypes: FeedbackType[] = [];

  constructor( private router: Router,
               private location: Location,
               private dialog: MatDialog,
               @Inject(FEEDBACK_SERVICE) private feedbackService: IFeedbackService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Feedback');
  }

  onFormSubmit(ev: Event, form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.submittingForm = true;
    const loadingPopup = this.dialog.open(LoadingPopUpComponent);
    this.feedbackService.sendFeedback({ content: form.value.content, types: this.feedbackTypes }).then(
      () => {
        console.log('Feedback submitted');
        this.location.back();
      },
      err => {
        console.warn('Failed submitting feedback', err);
      }
    ).finally(
      () => {
        this.submittingForm = false;
        loadingPopup.close();
      }
    );
  }

  onFeedbackTypeChange(ev: MatCheckboxChange, type: FeedbackType) {
    const index = this.feedbackTypes.indexOf(type);
    if (ev.checked) {
      if (index < 0) {
        this.feedbackTypes.push(type);
      }
    } else if (index >= 0) {
      this.feedbackTypes.splice(index, 1);
    }
  }
}
