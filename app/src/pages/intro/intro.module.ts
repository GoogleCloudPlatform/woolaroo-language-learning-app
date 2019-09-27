import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { PaginationIndicatorModule } from 'components/pagination-indicator/pagination-indicator.module';
import { IntroAboutPageComponent } from './about/about';

@NgModule({
  declarations: [
    IntroAboutPageComponent,
  ],
  imports: [
    MatButtonModule,
    PaginationIndicatorModule
  ]
})
export class IntroPageModule {}
