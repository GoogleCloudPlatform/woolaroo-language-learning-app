import { Component, Input } from '@angular/core';
import { Icon, IconComponent } from './icon';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-icon-button',
  template: '<button><mat-icon [svgIcon]="this.icon"></mat-icon></button>',
  styleUrls: ['./icon-button.scss']
})
export class IconButtonComponent {
  @Input()
  public icon: Icon|null = null;

  constructor(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    IconComponent.registerIcons(iconRegistry, domSanitizer);
  }
}
