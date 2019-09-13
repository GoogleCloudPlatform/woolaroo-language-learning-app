import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'page-translate',
  templateUrl: 'translate.html',
  styleUrls: ['./translate.scss']
})
export class TranslatePage {
  @ViewChild('background', {static: false})
  private background:ElementRef;

  constructor(private router:Router) {
  }

  ngAfterViewInit() {
    const image:Blob = history.state.capturedImage;
    if(!image) {
      this.router.navigate(['/capture']);
      return;
    }
    this.background.nativeElement.style.background = 'url(' + URL.createObjectURL(image) + ')';
  }
}
