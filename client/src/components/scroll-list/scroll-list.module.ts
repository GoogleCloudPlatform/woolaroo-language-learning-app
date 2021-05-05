import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollListItem, ScrollListComponent, SCROLL_LIST_CONFIG } from './scroll-list';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
    ScrollListItem,
    ScrollListComponent
  ],
  exports: [
    ScrollListItem,
    ScrollListComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: SCROLL_LIST_CONFIG, useValue: environment.components.scrollList }
  ]
})
export class ScrollListModule {}
