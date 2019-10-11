import { OnInit, Component, Inject, NgZone, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WordTranslation } from 'services/entities/translation';
import { environment } from 'environments/environment';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';
import { MatDialogRef } from '@angular/material';
import { ITranslationService, TRANSLATION_SERVICE } from 'services/translation';
import { AppRoutes } from 'app/routes';

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
               @Inject(TRANSLATION_SERVICE) private translationService: ITranslationService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
  }

  ngOnInit() {
    this.analyticsService.logPageView(this.router.url, 'Translate');
    const image: Blob = history.state.image;
    const words: string[] = history.state.words;
    const loadingPopUp: MatDialogRef<any>|undefined = history.state.loadingPopUp;
    if (!image) {
      const debugImageUrl: string | null = environment.translate.debugImageUrl;
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
    this.translationService.translate(words, 10).then( // TODO: config max words
      translations => {
        console.log('Translations loaded');
        if (loadingPopUp) {
          loadingPopUp.close();
        }
        this.zone.run(() => {
          console.log(translations);
          this.translations = translations;
        });
      },
      err => {
        console.warn('Error loading translations', err);
        if (loadingPopUp) {
          loadingPopUp.close();
        }
        this.router.navigateByUrl(AppRoutes.CaptionImage, { replaceUrl: true });
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
