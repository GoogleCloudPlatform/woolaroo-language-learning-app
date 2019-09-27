import {Component, Input} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

export type Icon = 'capture_photo'|'menu'|'close';

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
    iconRegistry.addSvgIcon('capture_photo', domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/camera_alt.svg'));
    iconRegistry.addSvgIcon('menu', domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/menu.svg'));
    iconRegistry.addSvgIcon('close', domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/close.svg'));
  }
}
