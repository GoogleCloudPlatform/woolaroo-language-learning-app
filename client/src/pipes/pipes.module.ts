import { NgModule } from '@angular/core';
import { AssetUrlPipe } from './asset-url';
import { StyleUrlPipe } from './style-url';

@NgModule({
  declarations: [
    AssetUrlPipe,
    StyleUrlPipe
  ],
  providers: [
    AssetUrlPipe,
    StyleUrlPipe
  ],
  exports: [
    AssetUrlPipe,
    StyleUrlPipe
  ]
})
export class PipesModule {}
