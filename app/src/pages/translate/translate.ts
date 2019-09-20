import {Component, NgZone} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { ImageTranslationService } from "services/image-translation";
import { WordTranslation } from "services/entities/translation";
import { environment } from "environments/environment";

@Component({
  selector: 'page-translate',
  templateUrl: './translate.html',
  styleUrls: ['./translate.scss']
})
export class TranslatePage {
  public backgroundImageURL:string|null = null;
  public translations:WordTranslation[]|null = null;

  constructor( private http:HttpClient,
               private router:Router,
               private imageTranslationService:ImageTranslationService,
               private zone:NgZone) {
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
    this.imageTranslationService.loadTranslatedDescriptions(image).then(
      translations => {
        console.log("Descriptions loaded", translations);
        this.zone.run(() => {
          this.translations = translations;
        });
      },
      err => {
        console.warn("Error loading image descriptions", err);
        this.router.navigate(['/capture'], { replaceUrl: true });
      }
    );
  }
}
