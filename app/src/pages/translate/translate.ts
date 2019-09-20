import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { ImageRecognitionService } from "services/image-recognition";
import { environment } from "environments/environment";

@Component({
  selector: 'page-translate',
  templateUrl: 'translate.html',
  styleUrls: ['./translate.scss']
})
export class TranslatePage {
  public backgroundImageURL:string|null = null;

  constructor( private http:HttpClient,
               private router:Router,
               private imageRecognitionService:ImageRecognitionService) {
  }

  ngAfterViewInit() {
    const image:Blob = history.state.capturedImage;
    if(!image) {
      if(!environment.translate.debugImageUrl) {
        console.warn("Image not found in state - returning to previous screen");
        this.router.navigate(['/capture'], { replaceUrl: true });
      } else {
        this.loadImage(environment.translate.debugImageUrl);
      }
    } else {
      this.setImageData(image);
    }
  }

  loadImage(url:string) {
    this.http.get(url, { responseType: "blob" }).subscribe({
      next: response => this.setImageData(response),
      error: () => this.router.navigate(['/capture'], { replaceUrl: true })
    });
  }

  setImageData(image:Blob) {
    this.backgroundImageURL = URL.createObjectURL(image);
    this.imageRecognitionService.loadDescriptions(image).then(
      descriptions => {
        console.log("Descriptions loaded", descriptions);
      },
      err => {
        console.warn("Error loading image descriptions", err);
        //this.router.navigate(['/capture'], { replaceUrl: true });
      }
    );
  }
}
