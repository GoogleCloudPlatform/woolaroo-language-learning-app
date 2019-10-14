import { Component, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

export type Icon = 'play_audio'|'record_audio'|'stop_audio'|'play_recording'|'back'|'add_feedback'|
  'add_to_home'|'brand'|'photo_library'|'capture_photo'|'menu'|'close'|'share';

@Component({
  selector: 'app-icon',
  template: '<mat-icon [svgIcon]="icon" [color]="color"></mat-icon>',
  styleUrls: ['./icon.scss']
})
export class IconComponent {
  @Input()
  public icon: Icon|null = null;
  @Input()
  public color: 'primary'|'accent'|'warn'|null = null;

  constructor(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    IconComponent.registerIcons(iconRegistry, domSanitizer);
  }

  public static registerIcons(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('capture_photo', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/radio_button_unchecked.svg'));
    iconRegistry.addSvgIcon('menu', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu.svg'));
    iconRegistry.addSvgIcon('close', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/close.svg'));
    iconRegistry.addSvgIcon('photo_library', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/photo_library.svg'));
    iconRegistry.addSvgIcon('brand', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/radio_button_unchecked.svg'));
    iconRegistry.addSvgIcon('add_to_home', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/save_alt.svg'));
    iconRegistry.addSvgIcon('add_feedback', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/chat_bubble_outline.svg'));
    iconRegistry.addSvgIcon('back', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow_back.svg'));
    iconRegistry.addSvgIcon('share', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/share.svg'));
    iconRegistry.addSvgIcon('play_audio', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/volume_up.svg'));
    iconRegistry.addSvgIcon('record_audio', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/mic.svg'));
    iconRegistry.addSvgIcon('stop_audio', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/stop.svg'));
    iconRegistry.addSvgIcon('play_recording', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/play_arrow.svg'));
  }
}
