import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IAnalyticsService, ANALYTICS_SERVICE } from '../../../services/analytics';
import { IProfileService, PROFILE_SERVICE } from '../../../services/profile';
import { AppRoutes } from '../../../app/routes';

@Component({
  selector: 'app-page-intro-terms',
  templateUrl: './terms.html',
  styleUrls: ['./terms.scss']
})
export class IntroTermsPageComponent implements AfterViewInit {
  @ViewChild('agreement', { static: true })
  private agreement: ElementRef | null = null;
  public termsUrl = AppRoutes.TermsAndConditions;

  constructor(private router: Router,
    @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService,
    @Inject(PROFILE_SERVICE) private profileService: IProfileService) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Intro - Terms & Privacy');
    if (this.agreement && this.agreement.nativeElement) {
      const agreement = this.agreement.nativeElement as HTMLElement;
      const links = agreement.getElementsByTagName('a');
      for (let k = 0; k < links.length; k++) {
        const link = links[k] as HTMLAnchorElement;
        link.addEventListener('click', (ev) => {
          ev.preventDefault();
          this.router.navigateByUrl(link.pathname);
        });
      }
    }
  }

  onAcceptClick() {
    this.profileService.loadProfile().then(
      (profile) => {
        profile.termsAgreed = true;
        profile.introViewed = true;
        this.profileService.saveProfile(profile).finally(() => this.router.navigateByUrl(AppRoutes.ChangeLanguage));
      },
      () => this.router.navigateByUrl(AppRoutes.ChangeLanguage)
    );
  }
}
