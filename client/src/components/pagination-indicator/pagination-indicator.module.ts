import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationIndicatorComponent } from './pagination-indicator';

@NgModule({
  declarations: [
    PaginationIndicatorComponent
  ],
  exports: [
    PaginationIndicatorComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PaginationIndicatorModule {}
