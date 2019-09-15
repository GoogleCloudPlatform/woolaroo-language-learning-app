import { NgModule } from '@angular/core';
import { MatIconModule } from "@angular/material";
import { IconComponent } from './icon';

@NgModule({
  declarations: [
    IconComponent
  ],
  exports: [
    IconComponent
  ],
  imports: [
    MatIconModule
  ]
})
export class IconComponentModule {}
