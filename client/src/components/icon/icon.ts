import { Component, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

export type Icon = 'play_audio'|'record_audio'|'stop_audio'|'play_recording'|'back'|'add_feedback'|
  'add_to_home'|'brand'|'photo_library'|'capture_photo'|'menu'|'close'|'share';

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

  constructor(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    IconComponent.registerIcons(iconRegistry, domSanitizer);
  }

  public static registerIcons(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    const baseUrl = environment.assets.baseUrl + 'assets/icons/';
    iconRegistry.addSvgIcon('capture_photo', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'radio_button_unchecked.svg'));
    iconRegistry.addSvgIcon('menu', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'menu.svg'));
    iconRegistry.addSvgIcon('close', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'close.svg'));
    iconRegistry.addSvgIcon('photo_library', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'photo_library.svg'));
    iconRegistry.addSvgIcon('brand', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'radio_button_unchecked.svg'));
    iconRegistry.addSvgIcon('add_to_home', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'save_alt.svg'));
    iconRegistry.addSvgIcon('add_feedback', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'chat_bubble_outline.svg'));
    iconRegistry.addSvgIcon('back', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'arrow_back.svg'));
    iconRegistry.addSvgIcon('share', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'share.svg'));
    iconRegistry.addSvgIcon('play_audio', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'volume_up.svg'));
    iconRegistry.addSvgIcon('record_audio', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'mic.svg'));
    iconRegistry.addSvgIcon('stop_audio', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'stop.svg'));
    iconRegistry.addSvgIcon('play_recording', domSanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'play_arrow.svg'));
  }
}
