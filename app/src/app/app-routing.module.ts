import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPage } from '../pages/landing/landing';
import { CapturePage } from '../pages/capture/capture';
import { TranslatePage } from '../pages/translate/translate';


const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'capture', component: CapturePage },
  { path: 'translate', component: TranslatePage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
