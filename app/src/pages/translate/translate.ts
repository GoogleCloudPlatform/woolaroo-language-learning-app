import { AfterViewInit, Component, Inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { ImageTranslationService } from "services/image-translation";
import { WordTranslation } from "services/entities/translation";
import { environment } from "environments/environment";
import { IAnalyticsService, ANALYTICS_SERVICE } from "../../services/analytics";

@Component({
  selector: 'page-translate',
  templateUrl: './translate.html',
  styleUrls: ['./translate.scss']
})
export class TranslatePage implements AfterViewInit {
  public backgroundImageURL: string|null = null;
  public translations: WordTranslation[]|null = null;

  constructor( private http: HttpClient,
               private router: Router,
               private zone: NgZone,
               private imageTranslationService: ImageTranslationService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Translate');
    const image: Blob = history.state.capturedImage;
    if(!image) {
      if(!environment.translate.debugImageUrl) {
        console.warn('Image not found in state - returning to previous screen');
        this.router.navigateByUrl('/capture', { replaceUrl: true });
      } else {
        this.loadImage(environment.translate.debugImageUrl);
      }
    } else {
      this.setImageData(image);
    }
  }

  loadImage(url: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: response => this.setImageData(response),
      error: () => this.router.navigateByUrl('/capture', { replaceUrl: true })
    });
  }

  setImageData(image:Blob) {
    this.backgroundImageURL = URL.createObjectURL(image);
    this.imageTranslationService.loadTranslatedDescriptions(image).then(
      translations => {
        console.log("Translations loaded");
        this.zone.run(() => {
          this.translations = translations;
        });
      },
      err => {
        console.warn("Error loading image descriptions", err);
        this.router.navigateByUrl('/capture', { replaceUrl: true });
      }
    );
  }

  onSubmitFeedbackClick() {
    this.router.navigateByUrl('/feedback');
  }
}
