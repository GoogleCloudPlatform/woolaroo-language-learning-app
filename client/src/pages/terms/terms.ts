import { AfterViewInit, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';

@Component({
  selector: 'app-page-terms',
  templateUrl: './terms.html',
  styleUrls: ['./terms.scss']
})
export class TermsPageComponent implements AfterViewInit {
  constructor( private router: Router,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Terms & Privacy');
  }

  onCloseClick() {
    history.back();
  }
}
