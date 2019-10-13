import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ServicesModule } from 'services/services.module';
import { CAPTION_IMAGE_PAGE_CONFIG, CaptionImagePageComponent } from 'pages/caption-image/caption-image';
import { PipesModule } from 'pipes/pipes.module';
import { IconComponentModule } from 'components/icon/icon.module';
import { environment } from 'environments/environment';

@NgModule({
  declarations: [
    CaptionImagePageComponent,
  ],
  imports: [
    ServicesModule,
    PipesModule,
    IconComponentModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule
  ],
  providers: [
    { provide: CAPTION_IMAGE_PAGE_CONFIG, useValue: environment.pages.captionImage }
  ]
})
export class CaptionImagePageModule {}
