import { AfterViewInit, Component, Inject, InjectionToken, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ANALYTICS_SERVICE, IAnalyticsService } from 'services/analytics';
import { FEEDBACK_SERVICE, IFeedbackService } from 'services/feedback';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';
import { startRecording, playBuffer, AudioStream } from 'util/audio';

enum RecordingState {
  Idle,
  Recording,
  Finished,
  Playing
}

interface AddWordConfig {
  maxRecordingDuration: number;
  recordingBufferSize: number;
}

export const ADD_WORD_CONFIG = new InjectionToken<AddWordConfig>('Add Word config');

@Component({
  selector: 'app-page-add-word',
  templateUrl: './add-word.html',
  styleUrls: ['./add-word.scss']
})
export class AddWordPageComponent implements AfterViewInit {
  private readonly form: FormGroup;
  public submittingForm = false;
  public currentRecordingState = RecordingState.Idle;
  public RecordingState = RecordingState;
  private audioStream: AudioStream|null = null;
  private recording: { buffer: Float32Array, duration: number}|null = null;

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
    this.currentRecordingState = RecordingState.Recording;
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
            this.currentRecordingState = RecordingState.Finished;
          });
        });
      },
      (err) => {
        console.warn('Error starting recording', err);
        this.zone.run(() => {
          this.currentRecordingState = RecordingState.Idle;
        });
      }
    );
  }

  onStopRecordingClick() {
    console.log('Stopping audio');
    if (this.audioStream) {
      this.audioStream.stop();
    }
    this.currentRecordingState = RecordingState.Finished;
  }

  onPlayRecordingClick() {
    console.log('Starting playback');
    if (!this.recording) {
      console.warn('No audio recorded');
      return;
    }
    this.currentRecordingState = RecordingState.Playing;
    playBuffer(this.recording.buffer, this.recording.duration).then(
      (stream) => {
        this.audioStream = stream;
        stream.setEndedListener(() => {
          console.log('Playback ended');
          this.zone.run(() => {
            this.currentRecordingState = RecordingState.Finished;
          });
        });
      },
      (err) => {
        console.warn('Error playing recording', err);
        this.zone.run(() => {
          this.currentRecordingState = RecordingState.Finished;
        });
      }
    );
  }
}
