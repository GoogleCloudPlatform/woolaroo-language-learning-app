import { AfterViewInit, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';
import { IProfileService, PROFILE_SERVICE } from 'services/profile';

@Component({
  selector: 'app-page-intro-terms',
  templateUrl: './terms.html',
  styleUrls: ['./terms.scss']
})
export class IntroTermsPageComponent implements AfterViewInit {
  constructor( private router: Router,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService,
               @Inject(PROFILE_SERVICE) private profileService: IProfileService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Intro - Terms & Privacy');
  }

  onAcceptClick() {
    this.profileService.loadProfile().then(
      (profile) => {
        profile.termsAgreed = true;
        this.profileService.saveProfile(profile).finally(() => this.router.navigateByUrl('/photo-source'));
      },
      () => this.router.navigateByUrl('/photo-source')
    );
  }
}
