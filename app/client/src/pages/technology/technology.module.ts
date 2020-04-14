import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TechnologyPageComponent } from './technology';
import { IconComponentModule } from 'components/icon/icon.module';
import { I18nModule } from 'i18n/i18n.module';

@NgModule({
  declarations: [
    TechnologyPageComponent,
  ],
  imports: [
    MatToolbarModule,
    IconComponentModule,
    I18nModule
  ]
})
export class TechnologyPageModule {}
