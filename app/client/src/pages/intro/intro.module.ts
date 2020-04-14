import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { PaginationIndicatorModule } from 'components/pagination-indicator/pagination-indicator.module';
import { IntroAboutPageComponent } from './about/about';
import { IntroFeedbackPageComponent } from './feedback/feedback';
import { IntroTermsPageComponent } from './terms/terms';
import { i18nModule } from 'i18n/i18n.module';

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
    i18nModule
  ]
})
export class IntroPageModule {}
