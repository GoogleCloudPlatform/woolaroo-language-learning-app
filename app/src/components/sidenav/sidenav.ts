import { Component } from '@angular/core';
import { SessionService } from 'services/session';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.scss']
})
export class SidenavComponent {
  get canAddToHomeScreen(): boolean { return !!this.sessionService.currentSession.installPrompt; }

  constructor(private sessionService: SessionService) {
  }

  onAddToHomeScreenClick() {
    this.sessionService.currentSession.installPrompt.prompt();
    this.sessionService.currentSession.installPrompt.userChoice.then((result: string) => {
      console.log('User result: ' + result);
    });
  }
}
