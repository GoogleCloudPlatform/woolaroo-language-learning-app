import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { PaginationIndicatorModule } from 'components/pagination-indicator/pagination-indicator.module';
import { IntroAboutPageComponent } from './about/about';
import { IntroFeedbackPageComponent } from './feedback/feedback';
import { IntroTermsPageComponent } from './terms/terms';

@NgModule({
  declarations: [
    IntroAboutPageComponent,
    IntroFeedbackPageComponent,
    IntroTermsPageComponent
  ],
  imports: [
    MatButtonModule,
    PaginationIndicatorModule
  ]
})
export class IntroPageModule {}
