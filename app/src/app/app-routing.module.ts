import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashPageComponent } from 'pages/splash/splash';
import { IntroAboutPageComponent } from 'pages/intro/about/about';
import { IntroFeedbackPageComponent } from 'pages/intro/feedback/feedback';
import { IntroTermsPageComponent } from 'pages/intro/terms/terms';
import { TermsPageComponent } from 'pages/terms/terms';
import { PhotoSourcePageComponent } from 'pages/photo-source/photo-source';
import { CapturePageComponent } from 'pages/capture/capture';
import { TranslatePageComponent } from 'pages/translate/translate';
import { FeedbackPageComponent } from 'pages/feedback/feedback';
import { AboutPageComponent } from 'pages/about/about';
import { TechnologyPageComponent } from 'pages/technology/technology';

const routes: Routes = [
  { path: '', component: SplashPageComponent },
  { path: 'intro', redirectTo: 'intro/about', pathMatch: 'full' },
  { path: 'intro/about', component: IntroAboutPageComponent },
  { path: 'intro/feedback', component: IntroFeedbackPageComponent },
  { path: 'intro/terms', component: IntroTermsPageComponent },
  { path: 'terms', component: TermsPageComponent },
  { path: 'photo-source', component: PhotoSourcePageComponent },
  { path: 'capture', component: CapturePageComponent },
  { path: 'translate', component: TranslatePageComponent },
  { path: 'feedback', component: FeedbackPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'technology', component: TechnologyPageComponent },
  { path: '**', component: SplashPageComponent } // TODO: not found page
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
