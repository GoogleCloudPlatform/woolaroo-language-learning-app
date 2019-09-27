import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-page-splash',
  templateUrl: 'splash.html',
  styleUrls: ['./splash.scss']
})
export class SplashPageComponent implements AfterViewInit, OnDestroy {
  private timeout: any = null;

  constructor( private router: Router,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Splash');
    this.timeout = setTimeout(() => {
      this.router.navigateByUrl('/intro');
    }, environment.splash.duration);
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}
