import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material';
import { TermsPageComponent } from './terms';
import { IconComponentModule } from 'components/icon/icon.module';

@NgModule({
  declarations: [
    TermsPageComponent,
  ],
  imports: [
    MatToolbarModule,
    IconComponentModule
  ]
})
export class TermsPageModule {}
