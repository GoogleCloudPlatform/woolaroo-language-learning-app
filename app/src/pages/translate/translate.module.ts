import { NgModule } from '@angular/core';
import { TranslatePage } from './translate';
import { ImageTranslationService } from "services/image-translation";
import { ImageRecognitionService } from "services/image-recognition";
import { TranslationService } from "services/translation";
import { TranslationSelectorModule } from "components/translation-selector/translation-selector.module";
import { PipesModule } from "pipes/pipes.module";

@NgModule({
  declarations: [
    TranslatePage,
  ],
  imports: [
    PipesModule,
    TranslationSelectorModule
  ],
  providers: [
    ImageTranslationService,
    ImageRecognitionService,
    TranslationService
  ]
})
export class TranslatePageModule {}
