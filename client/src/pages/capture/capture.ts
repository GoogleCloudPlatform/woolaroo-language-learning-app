import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { CameraPreviewComponent, CameraPreviewStatus } from 'components/camera-preview/camera-preview';
import { CapturePopUpComponent } from 'components/capture-popup/capture-popup';
import { ErrorPopUpComponent } from 'components/error-popup/error-popup';
import { ANALYTICS_SERVICE, IAnalyticsService } from 'services/analytics';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { IImageRecognitionService, IMAGE_RECOGNITION_SERVICE } from 'services/image-recognition';
import { AppRoutes } from 'app/routes';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';
import { SessionService } from 'services/session';

@Component({
  selector: 'app-page-capture',
  templateUrl: 'capture.html',
  styleUrls: ['./capture.scss']
})
export class CapturePageComponent implements AfterViewInit {
  @ViewChild(CameraPreviewComponent, {static: false})
  private cameraPreview: CameraPreviewComponent|null = null;
  public captureInProgress = false;
  public sidenavOpen = false;

  constructor( private router: Router,
               private dialog: MatDialog,
               private i18n: I18n,
               private sessionService: SessionService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService,
               @Inject(IMAGE_RECOGNITION_SERVICE) private imageRecognitionService: IImageRecognitionService) {
  }

  ngAfterViewInit() {
    let loadingPopUp: MatDialogRef<any>|undefined = this.sessionService.currentSession.currentModal;
    this.analyticsService.logPageView(this.router.url, 'Capture');
    if (!this.cameraPreview) {
      console.error('Camera preview not found');
      if (loadingPopUp) {
        loadingPopUp.close();
      }
      history.back();
      return;
    }
    if (!loadingPopUp) {
      loadingPopUp = this.dialog.open(LoadingPopUpComponent, {disableClose: true});
    }
    this.cameraPreview.start().then(
      () => {
        console.log('Camera started');
        if (loadingPopUp) {
          loadingPopUp.close();
        }
      },
      err => {
        console.warn('Error starting camera', err);
        if (loadingPopUp) {
          loadingPopUp.close();
        }
        const errorMessage = this.i18n({ id: 'startCameraError', value: 'Unable to start camera' });
        const errorDialog = this.dialog.open(ErrorPopUpComponent, { data: { message: errorMessage } });
        errorDialog.afterClosed().subscribe(() => {
          history.back();
        });
      }
    );
  }

  onCaptureClick() {
    if (!this.cameraPreview) {
      return;
    } else if (this.cameraPreview.status !== CameraPreviewStatus.Started) {
      return;
    }
    const preview = this.cameraPreview;
    this.captureInProgress = true;
    const loadingPopUp = this.dialog.open(CapturePopUpComponent, { closeOnNavigation: false, disableClose: true });
    this.sessionService.currentSession.currentModal = loadingPopUp;
    loadingPopUp.beforeClosed().subscribe({
      next: () => this.sessionService.currentSession.currentModal = null
    });
    loadingPopUp.afterOpened().subscribe({
      next: () => {
        preview.capture().then(
          image => {
            console.log('Image captured');
            this.loadImageDescriptions(image, loadingPopUp);
          },
          err => {
            console.warn('Failed to capture image', err);
            this.captureInProgress = false;
            loadingPopUp.close();
            const errorMessage = this.i18n({ id: 'captureImageError', value: 'Unable to capture image' });
            this.dialog.open(ErrorPopUpComponent, { data: { message: errorMessage } });
          }
        );
      }
    });
  }

  loadImageDescriptions(image: Blob, loadingPopUp: MatDialogRef<CapturePopUpComponent>) {
    this.imageRecognitionService.loadDescriptions(image).then(
      (descriptions) => {
        if (descriptions.length > 0) {
          this.router.navigateByUrl(AppRoutes.Translate, { state: { image, words: descriptions.map(d => d.description) } }).then(
            (success) => {
              if (!success) {
                loadingPopUp.close();
              }
            },
            () => loadingPopUp.close()
          );
        } else {
          this.router.navigateByUrl(AppRoutes.CaptionImage, { state: { image } }).finally(
            () => loadingPopUp.close()
          );
        }
      },
      (err) => {
        console.warn('Error loading image descriptions', err);
        loadingPopUp.close();
        this.router.navigateByUrl(AppRoutes.CaptionImage, { state: { image } }).finally(
          () => loadingPopUp.close()
        );
      }
    );
  }

  onOpenMenuClick() {
    this.sidenavOpen = !this.sidenavOpen;
  }

  onImageUploaded(image: Blob) {
    const loadingPopUp = this.dialog.open(LoadingPopUpComponent, { closeOnNavigation: false, disableClose: true });
    this.sessionService.currentSession.currentModal = loadingPopUp;
    loadingPopUp.afterOpened().subscribe({
      next: () => this.loadImageDescriptions(image, loadingPopUp)
    });
    loadingPopUp.beforeClosed().subscribe({
      next: () => this.sessionService.currentSession.currentModal = null
    });
  }

  onSidenavClosed() {
    this.sidenavOpen = false;
  }
}
