import { NgModule } from '@angular/core';
import { LandingPage } from './landing';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    LandingPage,
  ],
  imports: [
    MatButtonModule
  ]
})
export class LandingPageModule {}
