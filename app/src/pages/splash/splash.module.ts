import {NgModule} from '@angular/core';
import {SplashPageComponent} from './splash';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    SplashPageComponent,
  ],
  imports: [
    MatButtonModule
  ]
})
export class SplashPageModule {}
