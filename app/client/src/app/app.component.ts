import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { SessionService } from 'services/session';
import { I18nService } from 'i18n/i18n.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'google-barnard';

  constructor(private router: Router, private sessionService: SessionService, private i18nService: I18nService) {
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
    this.i18nService.currentLanguageChanged.subscribe(() => {
      window.document.body.setAttribute('dir', this.i18nService.currentLanguage.direction);
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
