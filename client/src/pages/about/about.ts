import { AfterViewInit, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IAnalyticsService, ANALYTICS_SERVICE } from '../../services/analytics';

@Component({
  selector: 'app-page-about',
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutPageComponent implements AfterViewInit {
  constructor(private router: Router,
    @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'About');
  }

  onCloseClick(ev: MouseEvent) {
    ev.stopPropagation();
    history.back();
  }
}
