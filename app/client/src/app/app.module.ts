import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SplashPageModule } from 'pages/splash/splash.module';
import { PhotoSourcePageModule } from 'pages/photo-source/photo-source.module';
import { CapturePageModule } from 'pages/capture/capture.module';
import { TranslatePageModule } from 'pages/translate/translate.module';
import { FeedbackPageModule } from 'pages/feedback/feedback.module';
import { IntroPageModule } from 'pages/intro/intro.module';
import { TermsPageModule } from 'pages/terms/terms.module';
import { AboutPageModule } from 'pages/about/about.module';
import { TechnologyPageModule } from 'pages/technology/technology.module';
import { LanguageSelectPageModule } from 'pages/language-select/language-select.module';
import { AddWordPageModule } from 'pages/add-word/add-word.module';
import { CaptionImagePageModule } from 'pages/caption-image/caption-image.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SplashPageModule,
    IntroPageModule,
    TermsPageModule,
    PhotoSourcePageModule,
    CapturePageModule,
    TranslatePageModule,
    AboutPageModule,
    TechnologyPageModule,
    FeedbackPageModule,
    AddWordPageModule,
    CaptionImagePageModule,
    LanguageSelectPageModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
