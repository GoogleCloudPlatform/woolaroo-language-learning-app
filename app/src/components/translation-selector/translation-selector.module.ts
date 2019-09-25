import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationSelectorComponent } from './translation-selector';

@NgModule({
  declarations: [
    TranslationSelectorComponent
  ],
  exports: [
    TranslationSelectorComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TranslationSelectorModule {}
