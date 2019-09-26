import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SplashPageComponent} from 'pages/splash/splash';
import {CapturePageComponent} from 'pages/capture/capture';
import {TranslatePage} from 'pages/translate/translate';
import {FeedbackPageComponent} from 'pages/feedback/feedback';


const routes: Routes = [
  { path: '', component: SplashPageComponent },
  { path: 'capture', component: CapturePageComponent },
  { path: 'translate', component: TranslatePage },
  { path: 'feedback', component: FeedbackPageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
