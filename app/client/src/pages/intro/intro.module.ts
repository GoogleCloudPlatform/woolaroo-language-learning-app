import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CarouselModule } from 'components/carousel/carousel.module';
import { LogoModule } from 'components/logo/logo.module';
import { PaginationIndicatorModule } from 'components/pagination-indicator/pagination-indicator.module';
import { IntroAboutPageComponent } from './about/about';
import { IntroFeedbackPageComponent } from './feedback/feedback';
import { IntroTermsPageComponent } from './terms/terms';
import { I18nModule } from 'i18n/i18n.module';

@NgModule({
  declarations: [
    IntroAboutPageComponent,
    IntroFeedbackPageComponent,
    IntroTermsPageComponent
  ],
  imports: [
    RouterModule,
    MatButtonModule,
    PaginationIndicatorModule,
    I18nModule,
    CarouselModule,
    LogoModule
  ]
})
export class IntroPageModule {}
