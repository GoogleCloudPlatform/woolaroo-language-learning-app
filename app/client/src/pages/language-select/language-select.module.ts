import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { I18nModule } from 'i18n/i18n.module';
import { LanguageSelectPageComponent } from './language-select';
import { IconComponentModule } from 'components/icon/icon.module';
import { CameraPreviewModule } from 'components/camera-preview/camera-preview.module';
import { CarouselModule} from 'components/carousel/carousel.module';

@NgModule({
  declarations: [
    LanguageSelectPageComponent
  ],
  exports: [
    LanguageSelectPageComponent
  ],
  imports: [
    RouterModule,
    MatButtonModule,
    CommonModule,
    I18nModule,
    IconComponentModule,
    CameraPreviewModule,
    CarouselModule
  ]
})
export class LanguageSelectPageModule {}
