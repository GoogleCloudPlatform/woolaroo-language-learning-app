import { OnInit, Component, Inject, NgZone, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ImageTranslationService } from 'services/image-translation';
import { WordTranslation } from 'services/entities/translation';
import { environment } from 'environments/environment';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';

@Component({
  selector: 'app-page-translate',
  templateUrl: './translate.html',
  styleUrls: ['./translate.scss']
})
export class TranslatePageComponent implements OnInit, OnDestroy {
  public backgroundImageURL: string|null = null;
  public translations: WordTranslation[]|null = null;

  constructor( private http: HttpClient,
               private router: Router,
               private zone: NgZone,
               private imageTranslationService: ImageTranslationService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
  }

  ngOnInit() {
    this.analyticsService.logPageView(this.router.url, 'Translate');
    const image: Blob = history.state.image;
    if (!image) {
      const debugImageUrl: string|null = environment.translate.debugImageUrl;
      if (!debugImageUrl) {
        console.warn('Image not found in state - returning to previous screen');
        history.back();
      } else {
        this.loadImage(debugImageUrl);
      }
    } else {
      this.setImageData(image);
    }
  }

  ngOnDestroy(): void {
    if (this.backgroundImageURL) {
      URL.revokeObjectURL(this.backgroundImageURL);
      this.backgroundImageURL = null;
    }
  }

  loadImage(url: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: response => this.setImageData(response),
      error: () => this.router.navigateByUrl('/capture', { replaceUrl: true })
    });
  }

  setImageData(image: Blob) {
    this.backgroundImageURL = URL.createObjectURL(image);
    this.imageTranslationService.loadTranslatedDescriptions(image).then(
      translations => {
        console.log('Translations loaded');
        this.zone.run(() => {
          this.translations = translations;
        });
      },
      err => {
        console.warn('Error loading image descriptions', err);
        history.back();
      }
    );
  }

  onSubmitFeedbackClick() {
    this.router.navigateByUrl('/feedback');
  }

  onBackClick() {
    history.back();
  }

  onWordShared(word: WordTranslation) {
    const nav: any = window.navigator;
    if (nav.share) {
      nav.share({ url: document.location.href, text: word.original, title: 'Barnard' });
    } else {
      // TODO
    }
  }

  onAddRecording() {
    // TODO
  }
}
