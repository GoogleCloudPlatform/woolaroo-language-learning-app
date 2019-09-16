import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'page-translate',
  templateUrl: 'translate.html',
  styleUrls: ['./translate.scss']
})
export class TranslatePage {
  @ViewChild('background', {static: false})
  private background:ElementRef|null = null;

  constructor(private router:Router) {
  }

  ngAfterViewInit() {
    const image:Blob = history.state.capturedImage;
    if(!image) {
      console.warn("Image not found in state - returning to previous screen");
      this.router.navigate(['/capture'], { replaceUrl: true });
      return;
    }
    this.background!.nativeElement.style.background = 'url(' + URL.createObjectURL(image) + ')';
  }
}
