import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { TranslatePageComponent } from './translate';
import { ServicesModule } from 'services/services.module';
import { IconComponentModule } from 'components/icon/icon.module';
import { TranslationSelectorModule } from 'components/translation-selector/translation-selector.module';
import { PipesModule } from 'pipes/pipes.module';

@NgModule({
  declarations: [
    TranslatePageComponent,
  ],
  imports: [
    MatButtonModule,
    IconComponentModule,
    PipesModule,
    TranslationSelectorModule,
    ServicesModule
  ]
})
export class TranslatePageModule {}
