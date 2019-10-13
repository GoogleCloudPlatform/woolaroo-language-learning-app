import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material';
import { AboutPageComponent } from './about';
import { IconComponentModule } from 'components/icon/icon.module';

@NgModule({
  declarations: [
    AboutPageComponent,
  ],
  imports: [
    MatToolbarModule,
    IconComponentModule
  ]
})
export class AboutPageModule {}
