import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SPLASH_PAGE_CONFIG, SplashPageComponent } from './splash';
import { LogoModule } from 'components/logo/logo.module';
import { PipesModule } from 'pipes/pipes.module';
import { environment } from 'environments/environment';

@NgModule({
  declarations: [
    SplashPageComponent,
  ],
  providers: [
    { provide: SPLASH_PAGE_CONFIG, useValue: environment.pages.splash }
  ],
  imports: [
    CommonModule,
    LogoModule,
    PipesModule
  ]
})
export class SplashPageModule {}
