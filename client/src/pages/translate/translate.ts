import { OnInit, Component, Inject, NgZone, OnDestroy, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';
import { WordTranslation } from 'services/entities/translation';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';
import { ITranslationService, TRANSLATION_SERVICE } from 'services/translation';
import { AppRoutes } from 'app/routes';

interface TranslatePageConfig {
  debugImageUrl?: string;
  debugWords?: string[];
}

export const TRANSLATE_PAGE_CONFIG = new InjectionToken<TranslatePageConfig>('Translate page config');

@Component({
  selector: 'app-page-translate',
  templateUrl: './translate.html',
  styleUrls: ['./translate.scss']
})
export class TranslatePageComponent implements OnInit, OnDestroy {
  public backgroundImageURL: string|null = null;
  public translations: WordTranslation[]|null = null;

  constructor( @Inject(TRANSLATE_PAGE_CONFIG) private config: TranslatePageConfig,
               private http: HttpClient,
               private router: Router,
               private zone: NgZone,
               @Inject(TRANSLATION_SERVICE) private translationService: ITranslationService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
  }

  ngOnInit() {
    this.analyticsService.logPageView(this.router.url, 'Translate');
    const image: Blob|undefined = history.state.image;
    const words: string[]|undefined = history.state.words || this.config.debugWords;
    const loadingPopUp: MatDialogRef<any>|undefined = history.state.loadingPopUp;
    if (!image) {
      const debugImageUrl = this.config.debugImageUrl;
      if (!debugImageUrl) {
        console.warn('Image not found in state - returning to previous screen');
        if (loadingPopUp) {
          loadingPopUp.close();
        }
        history.back();
      } else if (words) {
        this.loadImage(debugImageUrl, words, loadingPopUp);
      } else {
        this.router.navigateByUrl(AppRoutes.CaptionImage, { state: { image } });
      }
    } else if (!words) {
      this.router.navigateByUrl(AppRoutes.CaptionImage, { state: { image } });
    } else {
      this.setImageData(image);
      this.loadTranslations(words, loadingPopUp);
    }
  }

  ngOnDestroy(): void {
    if (this.backgroundImageURL) {
      URL.revokeObjectURL(this.backgroundImageURL);
      this.backgroundImageURL = null;
    }
  }

  loadImage(url: string, words: string[], loadingPopUp?: MatDialogRef<any>) {
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: response => {
        this.setImageData(response);
        this.loadTranslations(words, loadingPopUp);
      },
      error: () => {
        if (loadingPopUp) {
          loadingPopUp.close();
        }
        this.router.navigateByUrl(AppRoutes.CaptureImage, { replaceUrl: true });
      }
    });
  }

  setImageData(image: Blob) {
    this.backgroundImageURL = URL.createObjectURL(image);
  }

  loadTranslations(words: string[], loadingPopUp?: MatDialogRef<any>) {
    this.translationService.translate(words, 1).then(
      translations => {
        console.log('Translations loaded');
        if (loadingPopUp) {
          loadingPopUp.close();
        }
        this.zone.run(() => {
          this.translations = translations;
        });
      },
      err => {
        console.warn('Error loading translations', err);
        if (loadingPopUp) {
          loadingPopUp.close();
        }
        // show words as if none had translations
        this.zone.run(() => {
          this.translations = words.map(w => ({ original: w, translation: '', transliteration: '', soundURL: null }));
        });
      }
    );
  }

  onSubmitFeedbackClick() {
    this.router.navigateByUrl(AppRoutes.Feedback);
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

  onAddRecording(word: WordTranslation) {
    this.router.navigateByUrl(AppRoutes.AddWord, { state: { word }});
  }

  onAddTranslation(word: WordTranslation) {
    this.router.navigateByUrl(AppRoutes.AddWord, { state: { word }});
  }
}
