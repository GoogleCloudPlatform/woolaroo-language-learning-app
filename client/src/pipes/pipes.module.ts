import { NgModule } from '@angular/core';
import { AssetUrlPipe } from './asset-url';
import { StyleUrlPipe } from './style-url';
import { GcsUrlPipe } from './gcs-url.pipe';

@NgModule({
  declarations: [
    AssetUrlPipe,
    StyleUrlPipe,
    GcsUrlPipe
  ],
  providers: [
    AssetUrlPipe,
    StyleUrlPipe,
    GcsUrlPipe
  ],
  exports: [
    AssetUrlPipe,
    StyleUrlPipe,
    GcsUrlPipe
  ]
})
export class PipesModule { }
