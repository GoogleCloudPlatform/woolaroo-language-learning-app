import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { SessionService } from 'services/session';
import { I18nService } from 'i18n/i18n.service';
import { filter } from 'rxjs/operators';
import { EndangeredLanguageService } from '../services/endangered-language';
import { IProfileService, PROFILE_SERVICE } from '../services/profile';
import { Directionality } from '@angular/cdk/bidi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'google-barnard';

  constructor(private router: Router,
              private sessionService: SessionService,
              private i18nService: I18nService,
              private endangeredLanguageService: EndangeredLanguageService,
              private dir: Directionality,
              @Inject(PROFILE_SERVICE) private profileService: IProfileService) {
    // restore page state on back navigation
    this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      filter((e) => (e as NavigationStart).navigationTrigger === 'popstate')
    ).subscribe((e) => {
      const nav = this.router.getCurrentNavigation();
      if (!nav) {
        return;
      }
      const navStart = e as NavigationStart;
      nav.extras.state = {...navStart.restoredState, navigationId: navStart.id };
    });
    // load language settings
    this.profileService.loadProfile().then(
      profile => {
        if(profile.language) {
          this.i18nService.setLanguage(profile.language);
        }
        if(profile.endangeredLanguage) {
          this.endangeredLanguageService.setLanguage(profile.endangeredLanguage);
        }
      }
    );
    // save language settings on language change
    this.endangeredLanguageService.currentLanguageChanged.subscribe(() => {
      this.profileService.loadProfile().then(
        profile => {
          profile.endangeredLanguage = this.endangeredLanguageService.currentLanguage.code;
          this.profileService.saveProfile(profile);
        }
      );
    });
    this.i18nService.currentLanguageChanged.subscribe(() => {
      window.document.body.setAttribute('dir', this.i18nService.currentLanguage.direction);
      this.profileService.loadProfile().then(
        profile => {
          profile.language = this.i18nService.currentLanguage.code;
          this.profileService.saveProfile(profile);
        }
      );
    });
  }

  ngOnInit(): void {
    window.addEventListener('beforeinstallprompt', (ev) => {
      ev.preventDefault();
      this.sessionService.currentSession.installPrompt = ev;
    });
    // set document language direction
    window.document.body.setAttribute('dir', this.i18nService.currentLanguage.direction);
  }
}
