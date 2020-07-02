import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselItem, CarouselComponent, CAROUSEL_CONFIG } from './carousel';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
    CarouselItem,
    CarouselComponent
  ],
  exports: [
    CarouselItem,
    CarouselComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: CAROUSEL_CONFIG, useValue: environment.components.carousel }
  ]
})
export class CarouselModule {}
