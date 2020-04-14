import { NgModule } from '@angular/core';
import { TranslatePipe } from './i18n.pipes';
import { I18nService } from './i18n.service';

@NgModule({
  declarations: [
    TranslatePipe
  ],
  providers: [
    TranslatePipe,
    I18nService
  ],
  exports: [
    TranslatePipe
  ]
})
export class i18nModule {}
