import { NgModule } from '@angular/core';
import { SPLASH_PAGE_CONFIG, SplashPageComponent } from './splash';
import { LogoModule } from 'components/logo/logo.module';
import { environment } from 'environments/environment';

@NgModule({
  declarations: [
    SplashPageComponent,
  ],
  providers: [
    { provide: SPLASH_PAGE_CONFIG, useValue: environment.pages.splash }
  ],
  imports: [
    LogoModule
  ]
})
export class SplashPageModule {}
