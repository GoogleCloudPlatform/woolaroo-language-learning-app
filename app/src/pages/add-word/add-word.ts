import { AfterViewInit, Component, Inject, InjectionToken, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ANALYTICS_SERVICE, IAnalyticsService } from 'services/analytics';
import { FEEDBACK_SERVICE, IFeedbackService } from 'services/feedback';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';
import { startRecording, playBuffer, AudioStream } from 'util/audio';
import { OperatingSystem, getOperatingSystem } from 'util/platform';

enum RecordingState {
  Idle,
  Recording,
  Finished,
  Playing
}

interface AddWordConfig {
  maxRecordingDuration: number;
  recordingBufferSize: number;
  androidGBoardUrl: string;
  iosGBoardUrl: string;
  keymanUrl: string;
}

export const ADD_WORD_CONFIG = new InjectionToken<AddWordConfig>('Add Word config');

@Component({
  selector: 'app-page-add-word',
  templateUrl: './add-word.html',
  styleUrls: ['./add-word.scss']
})
export class AddWordPageComponent implements AfterViewInit {
  private readonly form: FormGroup;
  private audioStream: AudioStream|null = null;
  private recording: { buffer: Float32Array, duration: number}|null = null;
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
               private zone: NgZone,
               @Inject(FEEDBACK_SERVICE) private feedbackService: IFeedbackService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
    this.form = new FormGroup({
      nativeWord: new FormControl('', [
        Validators.required
      ]),
      englishWord: new FormControl('', [
        Validators.required
      ]),
      transliteration: new FormControl('', [
      ]),
      pronunciation: new FormControl(null, [
      ]),
    });
    this.operatingSystem = getOperatingSystem();
    this.keymanUrl = this.config.keymanUrl;
    this.gboardUrl = this.operatingSystem === OperatingSystem.Android ?
      this.config.androidGBoardUrl : this.config.iosGBoardUrl;
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
    this.feedbackService.sendFeedback(this.form.value).then(
      () => {
        console.log('Added word submitted');
        this.location.back();
      },
      err => {
        console.warn('Failed adding word', err);
      }
    ).finally(
      () => {
        this.submittingForm = false;
        loadingPopup.close();
      }
    );
  }

  onCloseClick() {
    history.back();
  }

  onStartRecordingClick() {
    console.log('Starting recording');
    this.recordingState = RecordingState.Recording;
    startRecording(this.config.recordingBufferSize).then(
      (stream) => {
        console.log('Recording started');
        const recordingTimeout = setTimeout(() => {
          stream.stop();
        }, this.config.maxRecordingDuration);
        this.audioStream = stream;
        stream.setEndedListener((buffer, duration) => {
          console.log('Recording complete: ' + duration);
          clearTimeout(recordingTimeout);
          this.recording = { buffer, duration };
          this.audioStream = null;
          this.zone.run(() => {
            this.recordingState = RecordingState.Finished;
          });
        });
      },
      (err) => {
        console.warn('Error starting recording', err);
        this.zone.run(() => {
          this.recordingState = RecordingState.Idle;
        });
      }
    );
  }

  onStopRecordingClick() {
    console.log('Stopping audio');
    if (this.audioStream) {
      this.audioStream.stop();
    }
    this.recordingState = RecordingState.Finished;
  }

  onPlayRecordingClick() {
    console.log('Starting playback');
    if (!this.recording) {
      console.warn('No audio recorded');
      return;
    }
    this.recordingState = RecordingState.Playing;
    playBuffer(this.recording.buffer, this.recording.duration).then(
      (stream) => {
        this.audioStream = stream;
        stream.setEndedListener(() => {
          console.log('Playback ended');
          this.zone.run(() => {
            this.recordingState = RecordingState.Finished;
          });
        });
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
