import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashPageComponent } from 'pages/splash/splash';
import { IntroAboutPageComponent } from 'pages/intro/about/about';
import { IntroFeedbackPageComponent } from 'pages/intro/feedback/feedback';
import { IntroTermsPageComponent } from 'pages/intro/terms/terms';
import { CapturePageComponent } from 'pages/capture/capture';
import { TranslatePage } from 'pages/translate/translate';
import { FeedbackPageComponent } from 'pages/feedback/feedback';

const routes: Routes = [
  { path: '', component: SplashPageComponent },
  { path: 'intro', redirectTo: 'intro/about', pathMatch: 'full' },
  { path: 'intro/about', component: IntroAboutPageComponent },
  { path: 'intro/feedback', component: IntroFeedbackPageComponent },
  { path: 'intro/terms', component: IntroTermsPageComponent },
  { path: 'photo-option', redirectTo: 'capture', pathMatch: 'full' },
  { path: 'capture', component: CapturePageComponent },
  { path: 'translate', component: TranslatePage },
  { path: 'feedback', component: FeedbackPageComponent },
  { path: '**', component: SplashPageComponent } // TODO: not found page
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
