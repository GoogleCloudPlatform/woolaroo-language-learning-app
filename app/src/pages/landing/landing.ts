import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
  styleUrls: ['./landing.scss']
})
export class LandingPage {
  constructor(private router:Router) {
  }

  private onStartClick() {
    this.router.navigate(["/capture"]);
  }
}
