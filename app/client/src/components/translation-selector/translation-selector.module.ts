import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material';
import { IconComponentModule } from 'components/icon/icon.module';
import { TranslationSelectorComponent } from './translation-selector';
import { SelectionLineComponent, SELECTION_LINE_CONFIG } from './selection-line';
import { WordScrollListComponent, WORD_SCROLL_LIST_CONFIG } from './word-scroll-list';
import { environment } from 'environments/environment';

@NgModule({
  declarations: [
    TranslationSelectorComponent,
    SelectionLineComponent,
    WordScrollListComponent
  ],
  exports: [
    TranslationSelectorComponent
  ],
  imports: [
    CommonModule,
    IconComponentModule,
    MatInputModule
  ],
  providers: [
    { provide: SELECTION_LINE_CONFIG, useValue: environment.components.translationSelector.selectionLine },
    { provide: WORD_SCROLL_LIST_CONFIG, useValue: environment.components.translationSelector.scrollList }
  ]
})
export class TranslationSelectorModule {}
