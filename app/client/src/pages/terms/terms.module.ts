import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TERMS_PAGE_CONFIG, TermsPageComponent } from './terms';
import { IconComponentModule } from 'components/icon/icon.module';
import { environment } from 'environments/environment';

@NgModule({
  declarations: [
    TermsPageComponent,
  ],
  providers: [
    { provide: TERMS_PAGE_CONFIG, useValue: environment.pages.termsAndPrivacy }
  ],
  imports: [
    MatToolbarModule,
    IconComponentModule
  ]
})
export class TermsPageModule {}
