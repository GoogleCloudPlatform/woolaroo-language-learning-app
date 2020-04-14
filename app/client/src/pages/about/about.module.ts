import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AboutPageComponent } from './about';
import { IconComponentModule } from 'components/icon/icon.module';
import { PipesModule } from 'pipes/pipes.module';

@NgModule({
  declarations: [
    AboutPageComponent,
  ],
  imports: [
    PipesModule,
    MatToolbarModule,
    IconComponentModule
  ]
})
export class AboutPageModule {}
