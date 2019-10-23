import { Component, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

export type Icon = 'play_audio'|'record_audio'|'stop_audio'|'play_recording'|'back'|'add_feedback'|
  'add_to_home'|'brand'|'photo_library'|'capture_photo'|'menu'|'close'|'share'|'search';

@Component({
  selector: 'app-icon',
  template: '<mat-icon class="shadow" [svgIcon]="icon" *ngIf="shadow"></mat-icon><mat-icon [svgIcon]="icon" [color]="color"></mat-icon>',
  styleUrls: ['./icon.scss']
})
export class IconComponent {
  @Input()
  public icon: Icon|null = null;
  @Input()
  public color: 'primary'|'accent'|'warn'|null = null;
  @Input()
  public shadow = false;

  constructor(private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.registerIcons();
  }

  private registerIcons() {
    const baseUrl = environment.assets.baseUrl + 'assets/icons/';
    const icons: {[index: string]: string} = {
      capture_photo: 'radio_button_unchecked.svg',
      menu: 'menu.svg',
      close: 'close.svg',
      photo_library: 'photo_library.svg',
      brand: 'radio_button_unchecked.svg',
      add_to_home: 'save_alt.svg',
      add_feedback: 'chat_bubble_outline.svg',
      back: 'arrow_back.svg',
      share: 'share.svg',
      play_audio: 'play_audio.svg',
      record_audio: 'mic.svg',
      stop_audio: 'stop.svg',
      play_recording: 'play_arrow.svg',
      search: 'search.svg',
    };
    for (const iconID of Object.keys(icons)) {
      this.iconRegistry.addSvgIcon(iconID, this.domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + icons[iconID]));
    }
  }
}
