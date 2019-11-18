import { NgModule } from '@angular/core';
import { ErrorStateMatcher, MatInputModule, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { IconComponentModule } from 'components/icon/icon.module';
import { ProgressBorderModule } from 'components/progress-border/progress-border.module';
import { environment } from 'environments/environment';
import { ADD_WORD_FIELDSET_CONFIG, AddWordFieldsetComponent } from './add-word-fieldset';

@NgModule({
  declarations: [
    AddWordFieldsetComponent
  ],
  providers: [
    { provide: ADD_WORD_FIELDSET_CONFIG, useValue: environment.components.addWordFieldset },
    // { provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher }
  ],
  exports: [
    AddWordFieldsetComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    IconComponentModule,
    ProgressBorderModule
  ]
})
export class AddWordFieldsetModule {}
