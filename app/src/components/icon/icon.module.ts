import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { IconComponent } from './icon';
import { IconButtonComponent } from './icon-button';

@NgModule({
  declarations: [
    IconComponent,
    IconButtonComponent
  ],
  exports: [
    IconComponent,
    IconButtonComponent
  ],
  imports: [
    MatIconModule
  ]
})
export class IconComponentModule {}
