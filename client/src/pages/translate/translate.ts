import { OnInit, Component, Inject, NgZone, OnDestroy, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WordTranslation } from '../../services/entities/translation';
import { IAnalyticsService, ANALYTICS_SERVICE } from '../../services/analytics';
import { ITranslationService, TRANSLATION_SERVICE } from '../../services/translation';
import { AppRoutes } from '../../app/routes';
import { ImageRenderingService } from '../../services/image-rendering';
import { downloadFile } from '../../util/file';
import { SessionService } from '../../services/session';
import { LoadingPopUpComponent } from '../../components/loading-popup/loading-popup';
import { I18nService } from '../../i18n/i18n.service';
import { EndangeredLanguageService } from '../../services/endangered-language';
import { share } from '../../util/share';
import { NotSupportedError } from '../../util/errors';
import { validateImageData, validateImageURL } from '../../util/image';
import { loadCapturePageURL } from '../../util/camera';
import { getLogger } from '../../util/logging';

const logger = getLogger('TranslatePageComponent');

interface TranslatePageConfig {
  debugImageUrl?: string;
  debugWords?: string[];
}

class WordsNotFoundError extends Error {
}

export const TRANSLATE_PAGE_CONFIG = new InjectionToken<TranslatePageConfig>('Translate page config');

@Component({
  selector: 'app-page-translate',
  templateUrl: './translate.html',
  styleUrls: ['./translate.scss']
})
export class TranslatePageComponent implements OnInit, OnDestroy {
  private _sharedImage: Blob | null = null;
  public backgroundImageData: Blob | null = null;
  public backgroundImageURL: string | null = null;
  public selectedWord: WordTranslation | null = null;
  public defaultSelectedWordIndex = -1;
  public translations: WordTranslation[] | null = null;

  public get currentLanguage(): string {
    return this.endangeredLanguageService.currentLanguage.name;
  }

  constructor(@Inject(TRANSLATE_PAGE_CONFIG) private config: TranslatePageConfig,
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
    const image: Blob | undefined = history.state.image;
    const imageURL: string | undefined = history.state.imageURL;
    const words: string[] | undefined = history.state.words || this.config.debugWords;
    let loadingPopUp: MatDialogRef<any> | undefined = this.sessionService.currentSession.currentModal;
    if (!loadingPopUp) {
      loadingPopUp = this.dialog.open(LoadingPopUpComponent, { closeOnNavigation: false, disableClose: true, panelClass: 'loading-popup' });
      this.sessionService.currentSession.currentModal = loadingPopUp;
      loadingPopUp.beforeClosed().subscribe({
        next: () => this.sessionService.currentSession.currentModal = null
      });
    }
    this.initImageTranslations(image, imageURL, words).then(
      () => {
        loadingPopUp?.close();
      },
      ex => {
        loadingPopUp?.close();
        if (ex instanceof WordsNotFoundError) {
          this.router.navigateByUrl(AppRoutes.CaptionImage, { state: { image } });
        } else {
          loadCapturePageURL().then(
            url => this.router.navigateByUrl(url, { replaceUrl: true }),
            () => this.router.navigateByUrl(AppRoutes.CaptureImage, { replaceUrl: true }),
          );
        }
      }
    );
  }

  ngOnDestroy(): void {
    const loadingPopUp: MatDialogRef<any> | undefined = this.sessionService.currentSession.currentModal;
    if (loadingPopUp) {
      loadingPopUp.close();
    }
  }

  async initImageTranslations(image: Blob | undefined, imageURL: string | undefined, words: string[] | undefined): Promise<void> {
    if (!image) {
      const debugImageUrl = this.config.debugImageUrl;
      if (!debugImageUrl) {
        logger.warn('Image not found in state - returning to previous screen');
        throw new Error('Image not found');
      } else if (words) {
        const debugImage = await this.loadImage(debugImageUrl);
        await this.setImageData(debugImage, debugImageUrl);
        await this.loadTranslations(words);
      } else {
        throw new WordsNotFoundError('Words not set');
      }
    } else if (!words) {
      throw new WordsNotFoundError('Words not set');
    } else {
      await this.setImageData(image, imageURL);
      await this.loadTranslations(words);
    }
  }

  async loadImage(url: string): Promise<Blob> {
    return await this.http.get(url, { responseType: 'blob' }).toPromise();
  }

  async setImageData(image: Blob, imageURL: string | undefined): Promise<void> {
    const valid = await validateImageData(image);
    if (!valid) {
      throw new Error('Invalid image data');
    }
    if (imageURL) {
      const urlValid = await validateImageURL(imageURL);
      if (urlValid) {
        this.setImageURL(imageURL);
      } else {
        URL.revokeObjectURL(imageURL);
        this.setImageURL(URL.createObjectURL(image));
      }
    } else {
      this.setImageURL(URL.createObjectURL(image));
    }
    this.backgroundImageData = image;
    this.renderShareImage();
  }

  setImageURL(url: string) {
    this.backgroundImageURL = url;
    const state = history.state;
    state.imageURL = url;
    history.replaceState(state, '');
  }

  async loadTranslations(words: string[]): Promise<void> {
    let translations: WordTranslation[];
    try {
      translations = await this.translationService.translate(words, this.i18n.currentLanguage.code,
        this.endangeredLanguageService.currentLanguage.code, 1);
    } catch (ex) {
      logger.warn('Error loading translations', ex);
      // show words as if none had translations
      this.zone.run(() => {
        this.translations = words.map(w => ({ original: w, english: '', translation: '', transliteration: '', soundURL: null }));
      });
      return;
    }
    logger.log('Translations loaded');
    this.zone.run(() => {
      this.translations = translations;
    });
  }

  onSubmitFeedbackClick() {
    this.router.createUrlTree([], {});
    this.router.navigateByUrl(AppRoutes.Feedback, { state: { word: this.selectedWord } });
  }

  onViewLanguageClick() {
    this.router.navigate([AppRoutes.ListLanguages, this.endangeredLanguageService.currentLanguage.code]);
  }

  onSwitchLanguageClick() {
    this.router.navigateByUrl(AppRoutes.ChangeLanguage);
  }

  onBackClick() {
    history.back();
  }

  renderShareImage() {
    if (!this.backgroundImageData || !this.selectedWord) {
      return;
    }
    const language = this.i18n.currentLanguage;
    const endangeredLanguage = this.endangeredLanguageService.currentLanguage;
    this.imageRenderingService.renderImage(this.backgroundImageData, this.selectedWord, language, endangeredLanguage,
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio).then(
        (img) => {
          this._sharedImage = img;
        },
        (err) => {
          logger.warn('Error rendering image', err);
          this._sharedImage = null;
        }
      );
  }

  onSelectedWordChanged(ev: { index: number, word: WordTranslation | null }) {
    if (ev.word) {
      this.selectedWord = ev.word;
    }
    const state = history.state;
    state.selectedWordIndex = ev.index;
    history.replaceState(state, '');
    this.renderShareImage();
  }

  onWordShared(word: WordTranslation) {
    const selectedWord = this.selectedWord;
    const shareTitle = this.i18n.getTranslation('shareTitle') || undefined;
    const shareText = selectedWord ? this.i18n.getTranslation('shareText', {
      original: selectedWord.original || selectedWord.english,
      translation: selectedWord.translation,
      language: this.endangeredLanguageService.currentLanguage.name
    }) || undefined : undefined;
    const img = this._sharedImage;
    if (!img) {
      // image not rendered - default to sharing text
      logger.warn('Shared image data not found');
      share({ text: shareText, title: shareTitle }).then(
        () => { },
        ex => logger.warn('Error sharing image', ex)
      );
      return;
    }
    const files: File[] = [new File([img], `woolaroo-translation-${word.original}.jpg`, { type: img.type })];
    share({ text: shareText, title: shareTitle, files }).then(
      () => { },
      ex => {
        logger.warn('Error sharing image', ex);
        if (ex instanceof NotSupportedError) {
          // sharing not supported - default to downloading image
          try {
            downloadFile(img, `woolaroo-translation-${word.original}.jpg`);
          } catch (err) {
            logger.warn('Error downloading image', err);
          }
        }
      }
    );
  }

  onManualEntrySelected() {
    this.router.navigateByUrl(AppRoutes.CaptionImage, { state: { image: this.backgroundImageData } });
  }

  onAddRecording(word: WordTranslation) {
    this.router.navigateByUrl(AppRoutes.AddWord, { state: { word } });
  }

  onAddTranslation(word: WordTranslation) {
    this.router.navigateByUrl(AppRoutes.AddWord, { state: { word } });
  }
}
