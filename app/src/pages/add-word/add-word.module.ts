import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { LoadingPopUpModule } from 'components/loading-popup/loading-popup.module';
import { AddWordPageComponent, ADD_WORD_CONFIG } from './add-word';
import { IconComponentModule } from 'components/icon/icon.module';
import { environment } from 'environments/environment';

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
    FormsModule,
    ReactiveFormsModule,
    LoadingPopUpModule,
    IconComponentModule
  ]
})
export class AddWordPageModule {}
