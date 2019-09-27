import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  styleUrls: ['./logo.scss']
})
export class LogoComponent implements AfterViewInit {
  constructor(private router: Router) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.router.navigateByUrl('/capture');
    }, environment.splash.duration);
  }
}
