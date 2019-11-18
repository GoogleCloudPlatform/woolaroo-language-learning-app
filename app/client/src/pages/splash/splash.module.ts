import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SPLASH_PAGE_CONFIG, SplashPageComponent } from './splash';
import { PipesModule } from 'pipes/pipes.module';
import { AnimationModule } from 'components/animation/animation.module';
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
    PipesModule,
    AnimationModule
  ]
})
export class SplashPageModule {}
