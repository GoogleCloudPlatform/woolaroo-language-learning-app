import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { SessionService } from 'services/session';
import { filter } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'google-barnard';

  constructor(private router: Router, private sessionService: SessionService, private i18n: I18n) {
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
  }

  ngOnInit(): void {
    window.addEventListener('beforeinstallprompt', (ev) => {
      ev.preventDefault();
      this.sessionService.currentSession.installPrompt = ev;
    });
    // set document language direction
    window.document.body.setAttribute('dir', this.i18n({id: 'dir', value: 'ltr'}));
  }
}
