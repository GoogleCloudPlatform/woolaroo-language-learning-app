import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatInputModule,
  MatToolbarModule,
  MatSnackBarModule, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher
} from '@angular/material';
import { LoadingPopUpModule } from 'components/loading-popup/loading-popup.module';
import { IconComponentModule } from 'components/icon/icon.module';
import { AddWordFieldsetModule } from 'components/add-word-fieldset/add-word-fieldset.module';
import { AddWordPageComponent } from './add-word';


export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (!control || control.valid) {
      return false;
    } else if (control.dirty) {
      return true;
    }
    let anyControlDirty = false;
    if (form) {
      for (const k of Object.keys(form.control.controls)) {
        if (form.control.controls[k].dirty) {
          anyControlDirty = true;
          break;
        }
      }
    }
    if (form && form.dirty) {
      return true;
    }
    return false;
  }
}

@NgModule({
  declarations: [
    AddWordPageComponent,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher }
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingPopUpModule,
    IconComponentModule,
    AddWordFieldsetModule
  ]
})
export class AddWordPageModule {}
