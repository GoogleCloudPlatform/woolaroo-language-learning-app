import { AfterViewInit, Component, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange, MatDialog, MatSnackBar } from '@angular/material';
import { ErrorPopUpComponent } from 'components/error-popup/error-popup';
import { ANALYTICS_SERVICE, IAnalyticsService } from 'services/analytics';
import { FEEDBACK_SERVICE, IFeedbackService } from 'services/feedback';
import { FeedbackType, Feedback } from 'services/entities/feedback';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { WordTranslation } from 'services/entities/translation';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-page-feedback',
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.scss']
})
export class FeedbackPageComponent implements AfterViewInit {
  public readonly feedbackForm: FormGroup;
  private readonly prevPageCssClass?: string;
  public submittingForm = false;
  public FeedbackType = FeedbackType;

  constructor( private router: Router,
               private location: Location,
               private dialog: MatDialog,
               private i18n: I18n,
               private snackBar: MatSnackBar,
               @Inject(FEEDBACK_SERVICE) private feedbackService: IFeedbackService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
    const word = history.state.word;
    this.feedbackForm = new FormGroup({
      nativeWord: new FormControl(word ? word.translation : '', [
      ]),
      englishWord: new FormControl(word ? word.original : '', [
      ]),
      transliteration: new FormControl(word ? word.transliteration : '', [
      ]),
      recording: new FormControl(null, [
      ]),
      content: new FormControl('', [
        Validators.required
      ]),
      types: new FormControl([], [
        (ctl) => ctl.dirty && (!ctl.value || ctl.value.length === 0) ? { required: true } : null
      ])
    });
    this.prevPageCssClass = history.state.prevPageCssClass;
    console.log(this.prevPageCssClass);
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Feedback');
  }

  onFormSubmit() {
    // Force validation of all fields
    for (const k of Object.keys(this.feedbackForm.controls)) {
      this.feedbackForm.controls[k].markAsDirty();
    }
    // Force types checkboxes to validate
    const typesControl = this.feedbackForm.controls.types;
    typesControl.updateValueAndValidity();
    if (!this.feedbackForm.valid) {
      return;
    }
    this.submittingForm = true;
    const loadingPopup = this.dialog.open(LoadingPopUpComponent, { panelClass: 'loading-popup' });
    const feedback: Feedback = this.feedbackForm.value;
    this.feedbackService.sendFeedback(feedback).then(
      () => {
        console.log('Feedback submitted');
        this.location.back();
        const snackbarCssClass = this.prevPageCssClass ? `${this.prevPageCssClass}-snack-bar` : '';
        this.snackBar.open(this.i18n({ id: 'feedbackSubmitted', value: 'Feedback submitted' }), '',
          { duration: environment.components.snackBar.duration, panelClass: snackbarCssClass });
      },
      err => {
        console.warn('Failed submitting feedback', err);
        const errorMessage = this.i18n({ id: 'submitFeedbackError', value: 'Unable to save feedback' });
        this.dialog.open(ErrorPopUpComponent, { data: { message: errorMessage } });
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

  onCloseClick(ev: Event) {
    ev.preventDefault();
    history.back();
  }
}
