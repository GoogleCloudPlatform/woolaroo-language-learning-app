import { OnInit, Component, Inject, NgZone, OnDestroy, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppRoutes } from 'app/routes';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';
import { SessionService } from 'services/session';
import { MatDialog } from '@angular/material';

interface CaptionImagePageConfig {
  debugImageUrl?: string;
}

export const CAPTION_IMAGE_PAGE_CONFIG = new InjectionToken<CaptionImagePageConfig>('Caption image page config');

@Component({
  selector: 'app-page-caption-image',
  templateUrl: './caption-image.html',
  styleUrls: ['./caption-image.scss']
})
export class CaptionImagePageComponent implements OnInit, OnDestroy {
  public readonly form: FormGroup;
  public backgroundImageURL: string|null = null;
  public image: Blob|null = null;

  constructor( @Inject(CAPTION_IMAGE_PAGE_CONFIG) private config: CaptionImagePageConfig,
               private http: HttpClient,
               private router: Router,
               private zone: NgZone,
               private dialog: MatDialog,
               private sessionService: SessionService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
    this.form = new FormGroup({
      caption: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit() {
    this.analyticsService.logPageView(this.router.url, 'Caption Image');
    const image: Blob = history.state.image;
    if (!image) {
      const debugImageUrl = this.config.debugImageUrl;
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
      next: response => {
        this.setImageData(response);
      },
      error: () => {
        this.router.navigateByUrl(AppRoutes.CaptureImage, { replaceUrl: true });
      }
    });
  }

  setImageData(image: Blob) {
    this.image = image;
    this.backgroundImageURL = URL.createObjectURL(image);
  }

  onFormSubmit() {
    if (!this.form.valid) {
      return;
    }
    const loadingPopUp = this.dialog.open(LoadingPopUpComponent, { closeOnNavigation: false, disableClose: true });
    this.sessionService.currentSession.currentModal = loadingPopUp;
    loadingPopUp.beforeClosed().subscribe({
      next: () => this.sessionService.currentSession.currentModal = null
    });
    loadingPopUp.afterOpened().subscribe({
      next: () => {
        this.router.navigateByUrl(AppRoutes.Translate, {state: {image: this.image, words: [this.form.value.caption]}});
      }
    });
  }

  onAddFeedbackClick() {
    this.router.navigateByUrl(AppRoutes.Feedback);
  }

  onBackClick() {
    history.back();
  }
}
