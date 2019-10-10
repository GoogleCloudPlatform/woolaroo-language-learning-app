import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { WordTranslation } from 'services/entities/translation';
import { Point } from 'util/geometry';

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
  @ViewChild('audioPlayer', {static: false})
  public audioPlayer: ElementRef|null = null;
  public audioPlaying = false;
  public lineTargetPosition: Point|null = null;

  public get shareAvailable(): boolean {
    return !!(window.navigator as any).share;
  }

  public selectedTranslation: WordTranslation|null = null;

  onPlayAudioClick() {
    if (!this.audioPlayer || !this.audioPlayer.nativeElement) {
      console.warn('Audio player not initialized');
      return;
    }
    const audioPlayer = this.audioPlayer.nativeElement as HTMLAudioElement;
    if (!this.audioPlaying) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }
  }

  onAudioPlaying() {
    this.audioPlaying = true;
  }

  onAudioStopped() {
    this.audioPlaying = false;
  }

  onSelectedWordChanged(translation: WordTranslation) {
    // will be fired immediately after "translations" is set, so need to delay changing
    // state again by a frame to avoid "expression changed after it was checked" error
    setTimeout(() => this.selectedTranslation = translation, 1);
  }

  onTargetPositionChanged(position: Point) {
    this.lineTargetPosition = position;
  }

  onAddRecordingClick() {
    if (this.selectedTranslation) {
      this.addRecording.emit(this.selectedTranslation);
    }
  }

  onAddTranslationClick() {
    if (this.selectedTranslation) {
      this.addTranslation.emit(this.selectedTranslation);
    }
  }

  onShareClick() {
    if (this.selectedTranslation) {
      this.wordShared.emit(this.selectedTranslation);
    }
  }
}
