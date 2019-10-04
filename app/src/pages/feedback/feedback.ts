import { AfterViewInit, Component, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange, MatDialog } from '@angular/material';
import { ANALYTICS_SERVICE, IAnalyticsService } from 'services/analytics';
import { FEEDBACK_SERVICE, IFeedbackService } from 'services/feedback';
import { FeedbackType, Feedback } from 'services/entities/feedback';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';

@Component({
  selector: 'app-page-feedback',
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.scss']
})
export class FeedbackPageComponent implements AfterViewInit {
  private readonly feedbackForm: FormGroup;
  public submittingForm = false;
  public FeedbackType = FeedbackType;
  public feedback: Feedback = { content: '', types: [] };

  constructor( private router: Router,
               private location: Location,
               private dialog: MatDialog,
               @Inject(FEEDBACK_SERVICE) private feedbackService: IFeedbackService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
    this.feedbackForm = new FormGroup({
      content: new FormControl('', [
        Validators.required
      ]),
      types: new FormControl([], [
        (ctl) => ctl.dirty && (!ctl.value || ctl.value.length === 0) ? { required: true } : null
      ])
    });
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Feedback');
  }

  onFormSubmit() {
    // Force types checkboxes to validate
    const typesControl = this.feedbackForm.controls.types;
    typesControl.markAsDirty();
    typesControl.updateValueAndValidity();
    if (!this.feedbackForm.valid) {
      return;
    }
    this.submittingForm = true;
    const loadingPopup = this.dialog.open(LoadingPopUpComponent);
    this.feedbackService.sendFeedback(this.feedback).then(
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
    const index = this.feedback.types.indexOf(type);
    if (ev.checked) {
      if (index < 0) {
        this.feedback.types.push(type);
      }
    } else if (index >= 0) {
      this.feedback.types.splice(index, 1);
    }
    const ctl = this.feedbackForm.controls.types;
    ctl.markAsDirty();
    ctl.markAsTouched();
    ctl.setValue(this.feedback.types);
  }

  onCloseClick() {
    history.back();
  }
}
