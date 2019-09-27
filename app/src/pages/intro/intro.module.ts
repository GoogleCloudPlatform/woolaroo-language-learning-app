import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
    RouterModule,
    MatButtonModule,
    PaginationIndicatorModule
  ]
})
export class IntroPageModule {}
