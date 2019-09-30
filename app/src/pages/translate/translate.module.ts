import { NgModule } from '@angular/core';
import { TranslatePageComponent } from './translate';
import { ServicesModule } from 'services/services.module';
import { TranslationSelectorModule } from 'components/translation-selector/translation-selector.module';
import { PipesModule } from 'pipes/pipes.module';

@NgModule({
  declarations: [
    TranslatePageComponent,
  ],
  imports: [
    PipesModule,
    TranslationSelectorModule,
    ServicesModule
  ]
})
export class TranslatePageModule {}
