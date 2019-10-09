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
  public readonly feedbackForm: FormGroup;
  public submittingForm = false;
  public FeedbackType = FeedbackType;

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
    this.feedbackService.sendFeedback(this.feedbackForm.value).then(
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

  typeIsSelected(type: FeedbackType): boolean {
    return this.feedbackForm.controls.types.value.indexOf(type) >= 0;
  }

  onFeedbackTypeChange(ev: MatCheckboxChange, type: FeedbackType) {
    const ctl = this.feedbackForm.controls.types;
    const types = ctl.value;
    const index = types.indexOf(type);
    if (ev.checked) {
      if (index < 0) {
        types.push(type);
      }
    } else if (index >= 0) {
      types.splice(index, 1);
    }
    ctl.markAsDirty();
    ctl.markAsTouched();
    ctl.setValue(types);
  }

  onCloseClick() {
    history.back();
  }
}
