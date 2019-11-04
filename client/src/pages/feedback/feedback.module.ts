import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatToolbarModule,
  MatSnackBarModule,
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher
} from '@angular/material';
import { LoadingPopUpModule } from 'components/loading-popup/loading-popup.module';
import { IconComponentModule } from 'components/icon/icon.module';
import { ErrorPopUpModule } from 'components/error-popup/error-popup.module';
import { AddWordFieldsetModule } from 'components/add-word-fieldset/add-word-fieldset.module';
import { FeedbackPageComponent } from './feedback';

@NgModule({
  declarations: [
    FeedbackPageComponent,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingPopUpModule,
    IconComponentModule,
    AddWordFieldsetModule,
    ErrorPopUpModule
  ]
})
export class FeedbackPageModule {}
