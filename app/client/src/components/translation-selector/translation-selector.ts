import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { WordTranslation } from 'services/entities/translation';
import { Point } from 'util/geometry';

enum AudioState {
  Stopped,
  Loading,
  Playing
}

@Component({
  selector: 'app-translation-selector',
  templateUrl: './translation-selector.html',
  styleUrls: ['./translation-selector.scss']
})
export class TranslationSelectorComponent {
  @Input()
  public translations: WordTranslation[]|null = null;
  @Output()
  public wordShared: EventEmitter<WordTranslation> = new EventEmitter<WordTranslation>();
  @Output()
  public addRecording: EventEmitter<WordTranslation> = new EventEmitter<WordTranslation>();
  @Output()
  public addTranslation: EventEmitter<WordTranslation> = new EventEmitter<WordTranslation>();
  @Output()
  public selectedWordChanged: EventEmitter<{index: number, word: WordTranslation|null}>
    = new EventEmitter<{index: number, word: WordTranslation|null}>();
  @Output()
  public manualEntrySelected: EventEmitter<any> = new EventEmitter();
  @ViewChild('audioPlayer')
  public audioPlayer: ElementRef|null = null;
  public audioStateValues = AudioState;
  public audioState: AudioState = AudioState.Stopped;
  public lineTargetPosition: Point|null = null;

  public selectedWordVisible = false;
  public selectedWord: WordTranslation|null = null;
  @Input()
  public defaultSelectedWordIndex = -1;

  onPlayAudioClick() {
    if (!this.audioPlayer || !this.audioPlayer.nativeElement) {
      console.warn('Audio player not initialized');
      return;
    }
    const audioPlayer = this.audioPlayer.nativeElement as HTMLAudioElement;
    switch (this.audioState) {
      case AudioState.Stopped:
        this.audioState = AudioState.Loading;
        audioPlayer.play().then(
          () => console.log('Audio started'),
          err => console.warn('Unable to start audio: ' + err.toString())
        );
        break;
      default:
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        break;
    }
  }

  onAudioPlaying() {
    console.log('Audio playing');
    this.audioState = AudioState.Playing;
  }

  onAudioStopped() {
    console.log('Audio stopped');
    this.audioState = AudioState.Stopped;
  }

  onSelectedWordChanged(ev: {index: number, word: WordTranslation|null}) {
    if (this.audioState !== AudioState.Stopped) {
      this.audioState = AudioState.Stopped;
      const audioPlayer = this.audioPlayer ? this.audioPlayer.nativeElement as HTMLAudioElement : null;
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
    }
    // will be fired immediately after "translations" is set, so need to delay changing
    // state again by a frame to avoid "expression changed after it was checked" error
    setTimeout(() => {
      this.selectedWordVisible = !!ev.word;
      // don't set selectedWord to null - we don't want to immediately hide translation, but transition out
      if (ev.word) {
        this.selectedWord = ev.word;
      }
    }, 1);
    this.selectedWordChanged.emit(ev);
  }

  onTargetPositionChanged(position: Point) {
    // will be fired immediately after "translations" is set, so need to delay changing
    // state again by a frame to avoid "expression changed after it was checked" error
    setTimeout(() => this.lineTargetPosition = position, 1);
  }

  onAddRecordingClick() {
    if (this.selectedWordVisible && this.selectedWord) {
      this.addRecording.emit(this.selectedWord);
    }
  }

  onAddTranslationClick() {
    if (this.selectedWordVisible && this.selectedWord) {
      this.addTranslation.emit(this.selectedWord);
    }
  }

  onManualEntrySelected() {
    this.manualEntrySelected.emit();
  }

  onShareClick() {
    if (this.selectedWordVisible && this.selectedWord) {
      this.wordShared.emit(this.selectedWord);
    }
  }
}
