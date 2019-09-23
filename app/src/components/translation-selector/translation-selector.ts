import {Component, ElementRef, Input, ViewChild} from "@angular/core";
import {WordTranslation} from "../../services/entities/translation";

@Component({
  selector: 'translation-selector',
  templateUrl: './translation-selector.html',
  styleUrls: ['./translation-selector.scss']
})
export class TranslationSelectorComponent {
  @Input()
  public translations:WordTranslation[]|null = null;
  @ViewChild('audioPlayer', {static: false})
  public audioPlayer:ElementRef|null = null;
  public selectedWordIndex:number = 0;
  public audioPlaying:boolean = false;

  public get selectedTranslation():WordTranslation|null {
    return this.translations && this.selectedWordIndex >= 0 ? this.translations[this.selectedWordIndex] : null;
  }

  onWordSelected(index:number) {
    this.selectedWordIndex = index;
  }

  onPlayAudioClick(ev:MouseEvent) {
    if(!this.audioPlayer || !this.audioPlayer.nativeElement) {
      console.warn("Audio player not initialized");
      return;
    }
    const audioPlayer = this.audioPlayer.nativeElement as HTMLAudioElement;
    if(!this.audioPlaying) {
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
}
