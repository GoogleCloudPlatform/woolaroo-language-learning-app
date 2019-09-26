import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SplashPageComponent} from 'pages/splash/splash';
import {CapturePage} from 'pages/capture/capture';
import {TranslatePage} from 'pages/translate/translate';
import {FeedbackPage} from 'pages/feedback/feedback';


const routes: Routes = [
  { path: '', component: SplashPageComponent },
  { path: 'capture', component: CapturePage },
  { path: 'translate', component: TranslatePage },
  { path: 'feedback', component: FeedbackPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
