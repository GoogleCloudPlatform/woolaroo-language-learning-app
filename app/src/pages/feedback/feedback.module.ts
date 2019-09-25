import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { LoadingPopUpModule } from 'components/loading-popup/loading-popup.module';
import { FeedbackPageComponent } from './feedback';

@NgModule({
  declarations: [
    FeedbackPageComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    FormsModule,
    LoadingPopUpModule
  ]
})
export class FeedbackPageModule {}
