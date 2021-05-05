import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  styleUrls: ['./logo.scss']
})
export class LogoComponent {
  @Input()
  public attributionEnabled: boolean = false;
}
