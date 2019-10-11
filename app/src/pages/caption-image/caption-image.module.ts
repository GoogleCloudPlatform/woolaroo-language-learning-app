import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ServicesModule } from 'services/services.module';
import { CaptionImagePageComponent } from 'pages/caption-image/caption-image';
import { PipesModule } from 'pipes/pipes.module';
import { IconComponentModule } from 'components/icon/icon.module';

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
  ]
})
export class CaptionImagePageModule {}
