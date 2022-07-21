import { OnInit, Component, Inject, NgZone, OnDestroy, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IAnalyticsService, ANALYTICS_SERVICE } from '../../services/analytics';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppRoutes } from '../../app/routes';
import { LoadingPopUpComponent } from '../../components/loading-popup/loading-popup';
import { SessionService } from '../../services/session';
import { MatDialog } from '@angular/material/dialog';
import { addOpenedListener } from '../../util/dialog';
import { validateImageURL } from '../../util/image';
import { getLogger } from '../../util/logging';

const logger = getLogger('CaptionImagePageComponent');

interface CaptionImagePageConfig {
  debugImageUrl?: string;
}

export const CAPTION_IMAGE_PAGE_CONFIG = new InjectionToken<CaptionImagePageConfig>('Caption image page config');

@Component({
  selector: 'app-page-caption-image',
  templateUrl: './caption-image.html',
  styleUrls: ['./caption-image.scss']
})
export class CaptionImagePageComponent implements OnInit {
  public readonly form: FormGroup;
  public backgroundImageURL: string | null = null;
  public image: Blob | null = null;

  constructor(@Inject(CAPTION_IMAGE_PAGE_CONFIG) private config: CaptionImagePageConfig,
    private http: HttpClient,
    private router: Router,
    private zone: NgZone,
    private dialog: MatDialog,
    private sessionService: SessionService,
    @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService) {
    this.form = new FormGroup({
      caption: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit() {
    this.analyticsService.logPageView(this.router.url, 'Caption Image');
    const image: Blob | undefined = history.state.image;
    const imageURL: string | undefined = history.state.imageURL;
    if (!image) {
      const debugImageUrl = this.config.debugImageUrl;
      if (!debugImageUrl) {
        logger.warn('Image not found in state - returning to previous screen');
        this.router.navigateByUrl(AppRoutes.CaptureImage, { replaceUrl: true });
      } else {
        this.loadImage(debugImageUrl);
      }
    } else {
      this.setImageData(image, imageURL);
    }
  }

  loadImage(url: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: response => {
        this.setImageData(response, url);
      },
      error: () => {
        this.router.navigateByUrl(AppRoutes.CaptureImage, { replaceUrl: true });
      }
    });
  }

  setImageData(image: Blob, imageURL: string | undefined) {
    if (imageURL) {
      validateImageURL(imageURL).then(
        valid => {
          if (valid) {
            this.backgroundImageURL = imageURL;
          } else {
            URL.revokeObjectURL(imageURL);
            this.setImageURL(URL.createObjectURL(image));
          }
        },
        () => {
          URL.revokeObjectURL(imageURL);
          this.setImageURL(URL.createObjectURL(image));
        }
      );
    } else {
      this.setImageURL(URL.createObjectURL(image));
    }
    this.image = image;
  }

  setImageURL(url: string) {
    this.backgroundImageURL = url;
    const state = history.state;
    state.imageURL = url;
    history.replaceState(state, '');
  }

  onFormSubmit() {
    if (!this.form.valid) {
      return;
    }
    const loadingPopUp = this.dialog.open(LoadingPopUpComponent,
      { closeOnNavigation: false, disableClose: true, panelClass: 'loading-popup' });
    this.sessionService.currentSession.currentModal = loadingPopUp;
    loadingPopUp.beforeClosed().subscribe({
      next: () => this.sessionService.currentSession.currentModal = null
    });
    addOpenedListener(loadingPopUp, () => {
      this.router.navigateByUrl(AppRoutes.Translate, {
        state: {
          image: this.image, imageURL: this.backgroundImageURL, words: [this.form.value.caption]
        }
      });
    });
  }

  onAddFeedbackClick() {
    this.router.navigateByUrl(AppRoutes.Feedback);
  }

  onBackClick() {
    history.back();
  }
}
