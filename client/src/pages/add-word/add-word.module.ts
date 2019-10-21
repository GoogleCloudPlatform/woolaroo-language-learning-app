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
import { ProgressBorderModule } from 'components/progress-border/progress-border.module';
import { environment } from 'environments/environment';
import { AddWordPageComponent, ADD_WORD_CONFIG } from './add-word';

@NgModule({
  declarations: [
    AddWordPageComponent,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: ADD_WORD_CONFIG, useValue: environment.pages.addWord }
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
    ProgressBorderModule
  ]
})
export class AddWordPageModule {}
