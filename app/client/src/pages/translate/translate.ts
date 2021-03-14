import { OnInit, Component, Inject, NgZone, OnDestroy, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WordTranslation } from 'services/entities/translation';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';
import { ITranslationService, TRANSLATION_SERVICE } from 'services/translation';
import { AppRoutes } from 'app/routes';
import { ImageRenderingService } from 'services/image-rendering';
import { downloadFile } from 'util/file';
import { SessionService } from 'services/session';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';
import { I18nService } from '../../i18n/i18n.service';
import { EndangeredLanguageService } from '../../services/endangered-language';
import { share } from '../../util/share';

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
  public backgroundImageData: Blob|null = null;
  public backgroundImageURL: string|null = null;
  public selectedWord: WordTranslation|null = null;
  public defaultSelectedWordIndex: number = -1;
  public translations: WordTranslation[]|null = null;

  public get currentLanguage(): string {
    return this.endangeredLanguageService.currentLanguage.name;
  }

  constructor( @Inject(TRANSLATE_PAGE_CONFIG) private config: TranslatePageConfig,
               private http: HttpClient,
               private dialog: MatDialog,
               private router: Router,
               private zone: NgZone,
               private sessionService: SessionService,
               private i18n: I18nService,
               private endangeredLanguageService: EndangeredLanguageService,
               @Inject(TRANSLATION_SERVICE) private translationService: ITranslationService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService,
               private imageRenderingService: ImageRenderingService) {
  }

  ngOnInit() {
    this.analyticsService.logPageView(this.router.url, 'Translate');
    this.defaultSelectedWordIndex = history.state.selectedWordIndex !== undefined ? history.state.selectedWordIndex : -1;
    const image: Blob|undefined = history.state.image;
    const words: string[]|undefined = history.state.words || this.config.debugWords;
    let loadingPopUp: MatDialogRef<any>|undefined = this.sessionService.currentSession.currentModal;
    if (!loadingPopUp) {
      loadingPopUp = this.dialog.open(LoadingPopUpComponent, { closeOnNavigation: false, disableClose: true, panelClass: 'loading-popup' });
      this.sessionService.currentSession.currentModal = loadingPopUp;
      loadingPopUp.beforeClosed().subscribe({
        next: () => this.sessionService.currentSession.currentModal = null
      });
    }
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
        if (loadingPopUp) {
          loadingPopUp.close();
        }
        this.router.navigateByUrl(AppRoutes.CaptionImage, { state: { image } });
      }
    } else if (!words) {
      if (loadingPopUp) {
        loadingPopUp.close();
      }
      this.router.navigateByUrl(AppRoutes.CaptionImage, { state: { image } });
    } else {
      this.setImageData(image);
      this.loadTranslations(words, loadingPopUp);
    }
  }

  ngOnDestroy(): void {
    const loadingPopUp: MatDialogRef<any>|undefined = this.sessionService.currentSession.currentModal;
    if (loadingPopUp) {
      loadingPopUp.close();
    }
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
    this.backgroundImageData = image;
    this.backgroundImageURL = URL.createObjectURL(image);
  }

  loadTranslations(words: string[], loadingPopUp?: MatDialogRef<any>) {
    this.translationService.translate(words, this.i18n.currentLanguage.code, this.endangeredLanguageService.currentLanguage.code, 1).then(
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
          this.translations = words.map(w => ({ original: w, english: '', translation: '', transliteration: '', soundURL: null }));
        });
      }
    );
  }

  onSubmitFeedbackClick() {
    this.router.createUrlTree([], {})
    this.router.navigateByUrl(AppRoutes.Feedback, { state: { word: this.selectedWord }});
  }

  onViewLanguageClick() {
    this.router.navigate([AppRoutes.ListLanguages, this.endangeredLanguageService.currentLanguage.code ]);
  }

  onSwitchLanguageClick() {
    this.router.navigateByUrl(AppRoutes.ChangeLanguage);
  }

  onBackClick() {
    history.back();
  }

  onSelectedWordChanged(ev: {index: number, word: WordTranslation|null}) {
    if(ev.word) {
      this.selectedWord = ev.word;
    }
    const state = history.state;
    state.selectedWordIndex = ev.index;
    history.replaceState(state, '');
  }

  onWordShared(word: WordTranslation) {
    if (!this.backgroundImageData) {
      console.warn('Background image data not found');
      return;
    }
    const language = this.i18n.currentLanguage;
    const endangeredLanguage = this.endangeredLanguageService.currentLanguage;
    this.imageRenderingService.renderImage(this.backgroundImageData, word, language, endangeredLanguage,
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio).then(
      (img) => {
        const selectedWord = this.selectedWord;
        const shareTitle = this.i18n.getTranslation('shareTitle' ) || undefined;
        const shareText = selectedWord ? this.i18n.getTranslation('shareText', {
          original: selectedWord.original || selectedWord.english,
          translation: selectedWord.translation,
          language: this.endangeredLanguageService.currentLanguage.name}) || undefined : undefined;
        const files: File[] = [new File([img], `woolaroo-translation-${word.original}.jpg`, { type: img.type })];
        share({text: shareText, title: shareTitle, files: files}).then(
          () => {},
          ex => {
            console.warn('Error sharing image', ex);
            try {
              downloadFile(img, `woolaroo-translation-${word.original}.jpg`);
            } catch (err) {
              console.warn('Error downloading image', err);
            }
          }
        );
      },
      (err) => {
        console.warn('Error rendering image', err);
      }
    );
  }

  onManualEntrySelected() {
    this.router.navigateByUrl(AppRoutes.CaptionImage, { state: { image: this.backgroundImageData }});
  }

  onAddRecording(word: WordTranslation) {
    this.router.navigateByUrl(AppRoutes.AddWord, { state: { word }});
  }

  onAddTranslation(word: WordTranslation) {
    this.router.navigateByUrl(AppRoutes.AddWord, { state: { word }});
  }
}
