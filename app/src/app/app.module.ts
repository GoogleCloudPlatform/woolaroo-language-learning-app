import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {SplashPageModule} from 'pages/splash/splash.module';
import {CapturePageModule} from 'pages/capture/capture.module';
import {TranslatePageModule} from 'pages/translate/translate.module';
import {FeedbackPageModule} from 'pages/feedback/feedback.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SplashPageModule,
    CapturePageModule,
    TranslatePageModule,
    FeedbackPageModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
