import {Component, Input} from "@angular/core";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'icon',
  template: '<mat-icon [color]="this.color" [svgIcon]="this.icon"></mat-icon>',
  styleUrls: ['./icon.scss']
})
export class IconComponent {
  @Input()
  public color:'accent'|'primary'|'warn' = 'primary';
  @Input()
  public icon:'capture_photo'|null = null;

  constructor(private iconRegistry:MatIconRegistry, private domSanitizer:DomSanitizer) {
    iconRegistry.addSvgIcon("capture_photo", domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/camera_alt.svg"));
  }
}
