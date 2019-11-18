import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatInputModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatSnackBarModule, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher
} from '@angular/material';
import { LoadingPopUpModule } from 'components/loading-popup/loading-popup.module';
import { IconComponentModule } from 'components/icon/icon.module';
import { AddWordFieldsetModule } from 'components/add-word-fieldset/add-word-fieldset.module';
import { AddWordPageComponent } from './add-word';

@NgModule({
  declarations: [
    AddWordPageComponent,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingPopUpModule,
    IconComponentModule,
    AddWordFieldsetModule
  ]
})
export class AddWordPageModule {}
