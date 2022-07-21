import { Component, Inject, InjectionToken, Input, NgZone } from '@angular/core';
import {
  audioRecordingIsAvailable,
  AudioStream, play, RecordingStream, startRecording
} from '../../util/audio';
import { getOperatingSystem, OperatingSystem } from '../../util/platform';
import { DEFAULT_LOCALE } from '../../util/locale';
import { FormGroup } from '@angular/forms';
import { I18nService } from '../../i18n/i18n.service';
import { getLogger } from '../../util/logging';

interface AddWordFieldsetConfig {
  maxRecordingDuration: number;
  recordingBufferSize: number;
  recordingMimeTypes: string[];
  androidGBoardUrl: string;
  iosGBoardUrl: string;
  keymanUrl: string;
  progressAnimationInterval: number;
}

export const ADD_WORD_FIELDSET_CONFIG = new InjectionToken<AddWordFieldsetConfig>('Add Word Fieldset config');

enum RecordingState {
  Idle,
  Recording,
  Finished,
  Playing
}

const logger = getLogger('AddWordFieldsetComponent');

@Component({
  selector: 'app-add-word-fieldset',
  templateUrl: './add-word-fieldset.html',
  styleUrls: ['./add-word-fieldset.scss']
})
export class AddWordFieldsetComponent {
  private audioStream: AudioStream | null = null;
  private recording: Blob | null = null;
  public recordingState = RecordingState.Idle;
  public recordingStateValues = RecordingState;
  public audioStreamProgress = 0;
  public operatingSystem: OperatingSystem;
  public operatingSystemValues = OperatingSystem;
  public gboardUrl: string;
  public keymanUrl: string;

  public get audioRecordingIsAvailable(): boolean { return audioRecordingIsAvailable(); }
  // only show primary language word if current language is not english
  public get primaryLanguageWordAvailable(): boolean { return this.i18n.currentLanguage.code != DEFAULT_LOCALE; }

  @Input()
  public formGroup: FormGroup | undefined = undefined;

  constructor(
    @Inject(ADD_WORD_FIELDSET_CONFIG) private config: AddWordFieldsetConfig,
    private zone: NgZone,
    private i18n: I18nService) {
    this.operatingSystem = getOperatingSystem();
    this.keymanUrl = this.config.keymanUrl;
    this.gboardUrl = this.operatingSystem === OperatingSystem.Android ?
      this.config.androidGBoardUrl : this.config.iosGBoardUrl;
  }

  public fieldHasError(field: string, error: string): boolean {
    if (!this.formGroup) {
      return false;
    }
    return this.formGroup.controls[field].hasError(error);
  }

  onStartRecordingClick(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    logger.log('Starting recording');
    this.audioStreamProgress = 0;
    this.recordingState = RecordingState.Recording;
    startRecording(this.config.recordingBufferSize, this.config.recordingMimeTypes).then(
      this.onRecordingStarted,
      (err) => {
        logger.warn('Error starting recording', err);
        this.zone.run(() => {
          this.recordingState = RecordingState.Idle;
        });
      }
    );
  }

  onRecordingStarted = (stream: RecordingStream) => {
    logger.log('Recording started');
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
      logger.log('Recording complete');
      clearTimeout(recordingTimeout);
      clearInterval(progressInterval);
      if (buffer.size > 0) {
        if (this.formGroup) {
          this.formGroup.controls.recording.setValue(buffer);
        }
        this.recording = buffer;
        this.audioStream = null;
        this.zone.run(() => {
          this.recordingState = RecordingState.Finished;
        });
      } else {
        if (this.formGroup) {
          this.formGroup.controls.recording.setValue(null);
        }
        this.recording = null;
        this.audioStream = null;
        this.zone.run(() => {
          this.recordingState = RecordingState.Idle;
        });
      }
    };
  }

  onStopRecordingClick(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    logger.log('Stopping audio');
    if (this.audioStream) {
      this.audioStream.stop();
    }
    this.recordingState = this.recording ? RecordingState.Finished : RecordingState.Idle;
  }

  onPlayRecordingClick(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    logger.log('Starting playback');
    if (!this.recording) {
      logger.warn('No audio recorded');
      alert('no audio');
      return false;
    }
    this.audioStreamProgress = 0;
    this.recordingState = RecordingState.Playing;
    play(this.recording).then(
      (stream) => {
        logger.log('Playback started');
        this.audioStream = stream;
        const progressInterval = setInterval(() => {
          this.zone.run(() => {
            let duration = stream.getDuration();
            if (!Number.isFinite(duration)) {
              duration = this.config.maxRecordingDuration * 0.001;
            }
            this.audioStreamProgress = stream.getCurrentTime() / duration;
          });
        }, this.config.progressAnimationInterval);
        stream.onended = () => {
          logger.log('Playback ended');
          clearInterval(progressInterval);
          this.zone.run(() => {
            this.recordingState = RecordingState.Finished;
          });
        };
      },
      (err) => {
        logger.warn('Error playing recording', err);
        alert(err);
        this.zone.run(() => {
          this.recordingState = RecordingState.Finished;
        });
      }
    );
  }
}
