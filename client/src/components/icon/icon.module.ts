import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from './icon';

@NgModule({
  declarations: [
    IconComponent
  ],
  exports: [
    IconComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class IconComponentModule {}
