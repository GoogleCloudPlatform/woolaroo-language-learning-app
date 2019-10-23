import { AfterViewInit, Component, Inject, InjectionToken, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ErrorPopUpComponent } from 'components/error-popup/error-popup';
import { ANALYTICS_SERVICE, IAnalyticsService } from 'services/analytics';
import { FEEDBACK_SERVICE, IFeedbackService } from 'services/feedback';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';
import { startRecording, play, AudioStream, RecordingStream } from 'util/audio';
import { OperatingSystem, getOperatingSystem } from 'util/platform';
import { WordTranslation } from 'services/entities/translation';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { environment } from 'environments/environment';
import { AddedWord } from 'services/entities/feedback';

enum RecordingState {
  Idle,
  Recording,
  Finished,
  Playing
}

interface AddWordConfig {
  maxRecordingDuration: number;
  recordingBufferSize: number;
  recordingMimeTypes: string[];
  androidGBoardUrl: string;
  iosGBoardUrl: string;
  keymanUrl: string;
  progressAnimationInterval: number;
}

export const ADD_WORD_CONFIG = new InjectionToken<AddWordConfig>('Add Word config');

@Component({
  selector: 'app-page-add-word',
  templateUrl: './add-word.html',
  styleUrls: ['./add-word.scss']
})
export class AddWordPageComponent implements AfterViewInit {
  public readonly form: FormGroup;
  private audioStream: AudioStream|null = null;
  private recording: Blob|null = null;
  private readonly prevPageCssClass?: string;
  public audioStreamProgress = 0;
  public submittingForm = false;
  public recordingState = RecordingState.Idle;
  public recordingStateValues = RecordingState;
  public operatingSystem: OperatingSystem;
  public operatingSystemValues = OperatingSystem;
  public gboardUrl: string;
  public keymanUrl: string;

  constructor( @Inject(ADD_WORD_CONFIG) private config: AddWordConfig,
               private router: Router,
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
      pronunciation: new FormControl(null, [
      ]),
    });
    this.operatingSystem = getOperatingSystem();
    this.keymanUrl = this.config.keymanUrl;
    this.gboardUrl = this.operatingSystem === OperatingSystem.Android ?
      this.config.androidGBoardUrl : this.config.iosGBoardUrl;
    this.prevPageCssClass = history.state.prevPageCssClass;
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Add word');
  }

  onFormSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.submittingForm = true;
    const loadingPopup = this.dialog.open(LoadingPopUpComponent);
    const addedWord: AddedWord = this.form.value;
    addedWord.recording = this.recording;
    this.feedbackService.addWord(addedWord).then(
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
    history.back();
  }

  onStartRecordingClick() {
    console.log('Starting recording');
    this.audioStreamProgress = 0;
    this.recordingState = RecordingState.Recording;
    startRecording(this.config.recordingBufferSize, this.config.recordingMimeTypes).then(
      this.onRecordingStarted,
      (err) => {
        console.warn('Error starting recording', err);
        this.zone.run(() => {
          this.recordingState = RecordingState.Idle;
        });
      }
    );
  }

  onRecordingStarted = (stream: RecordingStream) => {
    console.log('Recording started');
    this.audioStream = stream;
    const recordingTimeout = setTimeout(() => {
      stream.stop();
    }, this.config.maxRecordingDuration);
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      this.zone.run(() => {
        this.audioStreamProgress = (Date.now() - startTime) / this.config.maxRecordingDuration;
      });
    }, this.config.progressAnimationInterval);
    stream.onended = (buffer) => {
      console.log('Recording complete');
      clearTimeout(recordingTimeout);
      clearInterval(progressInterval);
      this.recording = buffer;
      this.audioStream = null;
      this.form.controls.pronunciation.setValue(buffer);
      this.zone.run(() => {
        this.recordingState = RecordingState.Finished;
      });
    };
  };

  onStopRecordingClick() {
    console.log('Stopping audio');
    if (this.audioStream) {
      this.audioStream.stop();
    }
    this.recordingState = this.recording ? RecordingState.Finished : RecordingState.Idle;
  }

  onPlayRecordingClick() {
    console.log('Starting playback');
    if (!this.recording) {
      console.warn('No audio recorded');
      return false;
    }
    this.audioStreamProgress = 0;
    this.recordingState = RecordingState.Playing;
    play(this.recording).then(
      (stream) => {
        const duration = Number.isFinite(stream.getDuration()) ? stream.getDuration() : this.config.maxRecordingDuration * 0.001;
        console.log(duration);
        this.audioStream = stream;
        const progressInterval = setInterval(() => {
          this.zone.run(() => {
            this.audioStreamProgress = stream.getCurrentTime() / duration;
          });
        }, this.config.progressAnimationInterval);
        stream.onended = () => {
          console.log('Playback ended');
          clearInterval(progressInterval);
          this.zone.run(() => {
            this.recordingState = RecordingState.Finished;
          });
        };
      },
      (err) => {
        console.warn('Error playing recording', err);
        this.zone.run(() => {
          this.recordingState = RecordingState.Finished;
        });
      }
    );
  }
}
