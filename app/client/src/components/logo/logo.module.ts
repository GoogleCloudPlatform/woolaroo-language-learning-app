import { NgModule } from '@angular/core';
import { LogoComponent } from './logo';
import { PipesModule } from 'pipes/pipes.module';

@NgModule({
  declarations: [
    LogoComponent
  ],
  exports: [
    LogoComponent
  ],
  imports: [
    PipesModule
  ]
})
export class LogoModule {}
