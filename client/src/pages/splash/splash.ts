import { AfterViewInit, Component, Inject, InjectionToken, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';
import { IProfileService, PROFILE_SERVICE } from 'services/profile';
import { AppRoutes } from 'app/routes';
import { AnimationComponent } from 'components/animation/animation';

interface SplashPageConfig {
  partnerLogoUrl?: string;
  videoMaxStartTime: number;
  showLogosVideoPosition: number;
  duration: number;
}

export const SPLASH_PAGE_CONFIG = new InjectionToken<SplashPageConfig>('Splash page config');

@Component({
  selector: 'app-page-splash',
  templateUrl: './splash.html',
  styleUrls: ['./splash.scss']
})
export class SplashPageComponent implements AfterViewInit, OnDestroy {
  private timeout: any = null;
  public partnerLogoUrl?: string;
  public videoStarted = false;
  public videoComplete = false;
  public logosVisible = false;
  @ViewChild('logoAnimation', { static: true })
  public logoAnimation: AnimationComponent|null = null;

  constructor( @Inject(SPLASH_PAGE_CONFIG) private config: SplashPageConfig,
               private router: Router,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService,
               @Inject(PROFILE_SERVICE) private profileService: IProfileService) {
    this.partnerLogoUrl = config.partnerLogoUrl;
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Splash');
    // if video hasn't started playing before timeout, skip it
    this.timeout = setTimeout(() => {
      this.videoComplete = true;
      if (!this.logosVisible) {
        this._showLogos();
      }
    }, this.config.videoMaxStartTime);
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  onVideoUpdate(ev: Event) {
    if (this.logosVisible) {
      return;
    }
    const video = ev.currentTarget as HTMLVideoElement;
    if (video.duration && video.currentTime / video.duration > this.config.showLogosVideoPosition) {
      this._showLogos();
    }
  }

  onVideoPlaying() {
    this.videoStarted = true;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  onVideoEnded() {
    this.videoComplete = true;
    if (!this.logosVisible) {
      this._showLogos();
    }
  }

  _showLogos() {
    this.logosVisible = true;
    if (this.logoAnimation) {
      this.logoAnimation.play();
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.profileService.loadProfile().then(
        (profile) => this.router.navigateByUrl(!profile.termsAgreed ? AppRoutes.Intro : AppRoutes.CaptureImage),
        () => this.router.navigateByUrl(AppRoutes.Intro)
      );
    }, this.config.duration);
  }
}
