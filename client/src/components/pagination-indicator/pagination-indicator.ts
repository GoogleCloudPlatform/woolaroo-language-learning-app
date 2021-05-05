import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pagination-indicator',
  templateUrl: './pagination-indicator.html',
  styleUrls: ['./pagination-indicator.scss']
})
export class PaginationIndicatorComponent {
  @Input()
  public selectedPage = 0;
  @Input()
  public pageCount = 0;

  public get pages(): boolean[] {
    const pages: boolean[] = [];
    for (let k = 0; k < this.pageCount; k++) {
      pages.push(k === this.selectedPage);
    }
    return pages;
  }
}
