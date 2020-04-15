import { NgModule } from '@angular/core';
import { TranslatePipe } from './i18n.pipes';
import { I18N_SERVICE_CONFIG, I18nService } from './i18n.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    TranslatePipe
  ],
  providers: [
    TranslatePipe,
    I18nService,
    { provide: I18N_SERVICE_CONFIG, useValue: environment.i18n },
  ],
  exports: [
    TranslatePipe
  ]
})
export class I18nModule {}
