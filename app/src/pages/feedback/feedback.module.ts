import { NgModule } from '@angular/core';
import { FeedbackPage } from './feedback';
import { FormsModule }   from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { LoadingPopUpModule } from "components/loading-popup/loading-popup.module";

@NgModule({
  declarations: [
    FeedbackPage,
  ],
  imports: [
    MatButtonModule,
    MatInputModule,
    FormsModule,
    LoadingPopUpModule
  ]
})
export class FeedbackPageModule {}
