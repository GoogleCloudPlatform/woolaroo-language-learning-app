import { AfterViewInit, Component, Inject, InjectionToken, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ANALYTICS_SERVICE, IAnalyticsService } from 'services/analytics';
import { FEEDBACK_SERVICE, IFeedbackService } from 'services/feedback';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';
import { startRecording, play, AudioStream, RecordingStream } from 'util/audio';
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
  private readonly form: FormGroup;
  private audioStream: AudioStream|null = null;
  private recording: Blob|null = null;
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
    this.recordingState = RecordingState.Finished;
  }

  onPlayRecordingClick() {
    console.log('Starting playback');
    if (!this.recording) {
      console.warn('No audio recorded');
      return;
    }
    this.audioStreamProgress = 0;
    this.recordingState = RecordingState.Playing;
    play(this.recording).then(
      (stream) => {
        this.audioStream = stream;
        const progressInterval = setInterval(() => {
          this.zone.run(() => {
            this.audioStreamProgress = stream.getCurrentTime() / stream.getDuration();
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
