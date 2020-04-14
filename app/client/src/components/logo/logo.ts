import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: '<img [src]="\'assets/img/logo.svg\' | assetUrl" [alt]="\'Woolaroo\' | translate:\'logo\'" />',
  styleUrls: ['./logo.scss']
})
export class LogoComponent {
}
