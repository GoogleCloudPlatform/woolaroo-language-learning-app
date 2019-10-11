import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { TranslatePageComponent, TRANSLATE_PAGE_CONFIG } from './translate';
import { ServicesModule } from 'services/services.module';
import { IconComponentModule } from 'components/icon/icon.module';
import { TranslationSelectorModule } from 'components/translation-selector/translation-selector.module';
import { PipesModule } from 'pipes/pipes.module';
import { environment } from 'environments/environment';

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
  ],
  providers: [
    { provide: TRANSLATE_PAGE_CONFIG, useValue: environment.pages.translate }
  ],
})
export class TranslatePageModule {}
