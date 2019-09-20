import { NgModule } from '@angular/core';
import { TranslatePage } from './translate';
import { ImageRecognitionService } from "services/image-recognition";
import { PipesModule } from "pipes/pipes.module";

@NgModule({
  declarations: [
    TranslatePage,
  ],
  imports: [
    PipesModule
  ],
  providers: [
    ImageRecognitionService
  ]
})
export class TranslatePageModule {}
