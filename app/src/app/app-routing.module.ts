import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPage } from '../pages/landing/landing';
import { CapturePage } from '../pages/capture/capture';


const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'capture', component: CapturePage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
