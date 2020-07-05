import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { I18nModule } from 'i18n/i18n.module';
import { ListLanguagesPageComponent } from './list-languages';
import { IconComponentModule } from 'components/icon/icon.module';
import { CarouselModule} from 'components/carousel/carousel.module';
import { PaginationIndicatorModule } from 'components/pagination-indicator/pagination-indicator.module';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    ListLanguagesPageComponent
  ],
  exports: [
    ListLanguagesPageComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    I18nModule,
    IconComponentModule,
    CarouselModule,
    PaginationIndicatorModule
  ]
})
export class ListLanguagesModule {}
