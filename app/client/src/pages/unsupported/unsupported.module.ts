import { NgModule } from '@angular/core';
import { UnsupportedPageComponent } from './unsupported';
import { I18nModule } from 'i18n/i18n.module';

@NgModule({
  declarations: [
    UnsupportedPageComponent,
  ],
  imports: [
    I18nModule
  ]
})
export class UnsupportedPageModule {}
