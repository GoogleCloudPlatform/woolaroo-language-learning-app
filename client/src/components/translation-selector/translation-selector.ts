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
  @Output()
  public selectedWordChanged: EventEmitter<WordTranslation> = new EventEmitter<WordTranslation>();
  @Output()
  public manualEntrySelected: EventEmitter<any> = new EventEmitter();
  @ViewChild('audioPlayer', {static: false})
  public audioPlayer: ElementRef|null = null;
  public audioPlaying = false;
  public lineTargetPosition: Point|null = null;

  public selectedWord: WordTranslation|null = null;

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
    setTimeout(() => this.selectedWord = translation, 1);
    this.selectedWordChanged.emit(translation);
  }

  onTargetPositionChanged(position: Point) {
    this.lineTargetPosition = position;
  }

  onAddRecordingClick() {
    if (this.selectedWord) {
      this.addRecording.emit(this.selectedWord);
    }
  }

  onAddTranslationClick() {
    if (this.selectedWord) {
      this.addTranslation.emit(this.selectedWord);
    }
  }

  onManualEntrySelected() {
    this.manualEntrySelected.emit();
  }

  onShareClick() {
    if (this.selectedWord) {
      this.wordShared.emit(this.selectedWord);
    }
  }
}
