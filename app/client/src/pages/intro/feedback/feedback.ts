import { AfterViewInit, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'app/routes';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';
import { environment } from 'environments/environment';
import { IProfileService, PROFILE_SERVICE } from 'services/profile';

@Component({
  selector: 'app-page-intro-feedback',
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.scss']
})
export class IntroFeedbackPageComponent implements AfterViewInit {
  constructor( private router: Router,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService,
               @Inject(PROFILE_SERVICE) private profileService: IProfileService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Intro - Feedback');
  }

  onNextClick() {
    if (environment.pages.termsAndPrivacy.enabled) {
      this.router.navigateByUrl(AppRoutes.IntroTermsAndConditions);
    } else {
      this.profileService.loadProfile().then(
        (profile) => {
          profile.introViewed = true;
          this.profileService.saveProfile(profile).finally(() => this.router.navigateByUrl(AppRoutes.ImageSource));
        },
        () => this.router.navigateByUrl(AppRoutes.ImageSource)
      );
    }
  }
}
