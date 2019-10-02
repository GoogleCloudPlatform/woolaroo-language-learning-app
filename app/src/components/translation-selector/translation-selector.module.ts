import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponentModule } from 'components/icon/icon.module';
import { TranslationSelectorComponent } from './translation-selector';

@NgModule({
  declarations: [
    TranslationSelectorComponent
  ],
  exports: [
    TranslationSelectorComponent
  ],
  imports: [
    CommonModule,
    IconComponentModule
  ]
})
export class TranslationSelectorModule {}
