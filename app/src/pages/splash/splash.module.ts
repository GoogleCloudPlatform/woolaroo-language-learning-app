import { NgModule } from '@angular/core';
import { SplashPageComponent } from './splash';
import { LogoModule } from 'components/logo/logo.module';

@NgModule({
  declarations: [
    SplashPageComponent,
  ],
  imports: [
    LogoModule
  ]
})
export class SplashPageModule {}
