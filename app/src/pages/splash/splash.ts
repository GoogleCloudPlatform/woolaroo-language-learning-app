import { AfterViewInit, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';

@Component({
  selector: 'app-page-splash',
  templateUrl: 'splash.html',
  styleUrls: ['./splash.scss']
})
export class SplashPageComponent implements AfterViewInit {
  constructor( private router: Router,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Capture');
  }

  onStartClick() {
    this.router.navigate(['/capture']);
  }
}
