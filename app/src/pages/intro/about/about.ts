import { AfterViewInit, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';

@Component({
  selector: 'app-page-intro-about',
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class IntroAboutPageComponent implements AfterViewInit {
  constructor( private router: Router,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Intro - About');
  }

  onNextClick() {
    this.router.navigateByUrl('/intro/feedback');
  }

  onSkipClick() {
    this.router.navigateByUrl('/photo-option');
  }
}
