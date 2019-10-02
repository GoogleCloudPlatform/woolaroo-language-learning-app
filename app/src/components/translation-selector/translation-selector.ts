import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {WordTranslation} from 'services/entities/translation';

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
  public addRecording: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('audioPlayer', {static: false})
  public audioPlayer: ElementRef|null = null;
  public selectedWordIndex = 0;
  public audioPlaying = false;

  public get selectedTranslation(): WordTranslation|null {
    return this.translations && this.selectedWordIndex >= 0 ? this.translations[this.selectedWordIndex] : null;
  }

  onWordSelected(index: number) {
    this.selectedWordIndex = index;
  }

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

  onAddRecordingClick() {
    this.addRecording.emit();
  }

  onShareClick() {
    if (this.selectedTranslation) {
      this.wordShared.emit(this.selectedTranslation);
    }
  }
}
