import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageModule } from '../pages/landing/landing.module';
import { CapturePageModule } from '../pages/capture/capture.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LandingPageModule,
    CapturePageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
