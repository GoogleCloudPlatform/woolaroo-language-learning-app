import { Component } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.html',
  styleUrls: ['./page-header.scss']
})
export class PageHeaderComponent {
  onCloseClick(ev: MouseEvent) {
    ev.stopPropagation();
    history.back();
  }
}
