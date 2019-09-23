import {Component, Inject} from '@angular/core';
import { Router } from "@angular/router";
import {ANALYTICS_SERVICE, IAnalyticsService} from "services/analytics";

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
  styleUrls: ['./landing.scss']
})
export class LandingPage {
  constructor( private router:Router,
               @Inject(ANALYTICS_SERVICE) private analyticsService:IAnalyticsService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Capture');
  }

  onStartClick() {
    this.router.navigate(["/capture"]);
  }
}
