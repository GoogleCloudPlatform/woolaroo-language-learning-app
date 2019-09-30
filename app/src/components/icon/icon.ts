import {Component, Input} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

export type Icon = 'add_to_home'|'brand'|'photo_library'|'capture_photo'|'menu'|'close';

@Component({
  selector: 'app-icon',
  template: '<mat-icon [svgIcon]="this.icon"></mat-icon>',
  styleUrls: ['./icon.scss']
})
export class IconComponent {
  @Input()
  public icon: Icon|null = null;

  constructor(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    IconComponent.registerIcons(iconRegistry, domSanitizer);
  }

  public static registerIcons(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('capture_photo', domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/radio_button_unchecked.svg'));
    iconRegistry.addSvgIcon('menu', domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/menu.svg'));
    iconRegistry.addSvgIcon('close', domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/close.svg'));
    iconRegistry.addSvgIcon('photo_library', domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/photo_library.svg'));
    iconRegistry.addSvgIcon('brand', domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/radio_button_unchecked.svg'));
    iconRegistry.addSvgIcon('add_to_home', domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/save_alt.svg'));
  }
}
