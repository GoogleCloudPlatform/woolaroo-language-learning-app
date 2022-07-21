import { AfterViewInit, Component, Inject, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { IAnalyticsService, ANALYTICS_SERVICE } from '../../services/analytics';

interface TermsPageConfig {
  enabled: boolean;
  content: string;
}


export const TERMS_PAGE_CONFIG = new InjectionToken<TermsPageConfig>('Terms page config');

@Component({
  selector: 'app-page-terms',
  templateUrl: './terms.html',
  styleUrls: ['./terms.scss']
})
export class TermsPageComponent implements AfterViewInit {
  public content: string;

  constructor(@Inject(TERMS_PAGE_CONFIG) private config: TermsPageConfig,
    private router: Router,
    @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService) {
    this.content = config.content;
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Terms & Privacy');
  }

  onCloseClick(ev: MouseEvent) {
    ev.stopPropagation();
    history.back();
  }
}
