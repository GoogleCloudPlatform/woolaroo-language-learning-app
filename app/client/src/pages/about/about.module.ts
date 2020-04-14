import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AboutPageComponent } from './about';
import { IconComponentModule } from 'components/icon/icon.module';
import { PipesModule } from 'pipes/pipes.module';
import { I18nModule } from 'i18n/i18n.module';

@NgModule({
  declarations: [
    AboutPageComponent,
  ],
  imports: [
    PipesModule,
    MatToolbarModule,
    IconComponentModule,
    I18nModule
  ]
})
export class AboutPageModule {}
