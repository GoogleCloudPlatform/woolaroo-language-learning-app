import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: '<img [src]="\'assets/img/logo.svg\' | assetUrl" i18n-alt="@@logo" alt="Woolaroo" />',
  styleUrls: ['./logo.scss']
})
export class LogoComponent {
}
