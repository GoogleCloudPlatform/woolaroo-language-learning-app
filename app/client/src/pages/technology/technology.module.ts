import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TechnologyPageComponent } from './technology';
import { IconComponentModule } from 'components/icon/icon.module';

@NgModule({
  declarations: [
    TechnologyPageComponent,
  ],
  imports: [
    MatToolbarModule,
    IconComponentModule
  ]
})
export class TechnologyPageModule {}
