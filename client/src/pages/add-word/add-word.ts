import { AfterViewInit, Component, Inject, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ErrorPopUpComponent } from 'components/error-popup/error-popup';
import { ANALYTICS_SERVICE, IAnalyticsService } from 'services/analytics';
import { FEEDBACK_SERVICE, IFeedbackService } from 'services/feedback';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';
import { WordTranslation } from 'services/entities/translation';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-page-add-word',
  templateUrl: './add-word.html',
  styleUrls: ['./add-word.scss']
})
export class AddWordPageComponent implements AfterViewInit {
  public readonly form: FormGroup;
  private readonly prevPageCssClass?: string;
  public submittingForm = false;

  public get endangeredLanguage(): string { return environment.endangeredLanguage; }

  constructor( private router: Router,
               private location: Location,
               private dialog: MatDialog,
               private snackBar: MatSnackBar,
               private zone: NgZone,
               private i18n: I18n,
               @Inject(FEEDBACK_SERVICE) private feedbackService: IFeedbackService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
    const word: WordTranslation = history.state.word;
    this.form = new FormGroup({
      nativeWord: new FormControl(word ? word.translation : '', [
        Validators.required
      ]),
      englishWord: new FormControl(word ? word.original : '', [
        Validators.required
      ]),
      transliteration: new FormControl(word ? word.transliteration : '', [
      ]),
      recording: new FormControl(null, [
      ]),
    });
    this.prevPageCssClass = history.state.prevPageCssClass;
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Add word');
  }

  onFormSubmit() {
    // Force validation of all fields
    for (const k of Object.keys(this.form.controls)) {
      this.form.controls[k].markAsDirty();
    }
    if (!this.form.valid) {
      return;
    }
    this.submittingForm = true;
    const loadingPopup = this.dialog.open(LoadingPopUpComponent, { panelClass: 'loading-popup' });
    this.feedbackService.addWord(this.form.value).then(
      () => {
        console.log('Added word submitted');
        this.location.back();
        const snackbarCssClass = this.prevPageCssClass ? `${this.prevPageCssClass}-snack-bar` : '';
        this.snackBar.open(this.i18n({ id: 'wordSubmitted', value: 'Submitted for review' }), '',
          { duration: environment.components.snackBar.duration, panelClass: snackbarCssClass });
      },
      err => {
        console.warn('Failed adding word', err);
        const errorMessage = this.i18n({ id: 'addWordError', value: 'Unable to add word' });
        this.dialog.open(ErrorPopUpComponent, { data: { message: errorMessage } });
      }
    ).finally(
      () => {
        this.submittingForm = false;
        loadingPopup.close();
      }
    );
  }

  onCloseClick(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    history.back();
  }
}
