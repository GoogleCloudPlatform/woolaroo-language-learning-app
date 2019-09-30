import { Component, OnInit } from '@angular/core';
import { SessionService } from 'services/session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'google-barnard';

  constructor(private sessionService: SessionService) {
  }

  ngOnInit(): void {
    window.addEventListener('beforeinstallprompt', (ev) => {
      ev.preventDefault();
      this.sessionService.currentSession.installPrompt = ev;
    });
  }
}
