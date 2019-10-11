import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { CameraPreviewComponent, CameraPreviewStatus } from 'components/camera-preview/camera-preview';
import { CapturePopUpComponent } from 'components/capture-popup/capture-popup';
import { ErrorPopUpComponent } from 'components/error-popup/error-popup';
import { ANALYTICS_SERVICE, IAnalyticsService } from 'services/analytics';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { IImageRecognitionService, IMAGE_RECOGNITION_SERVICE } from 'services/image-recognition';
import { AppRoutes } from 'app/routes';

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
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService,
               @Inject(IMAGE_RECOGNITION_SERVICE) private imageRecognitionService: IImageRecognitionService) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Capture');
    if (!this.cameraPreview) {
      console.error('Camera preview not found');
      history.back();
      return;
    }
    this.cameraPreview.start().then(
      () => console.log('Camera started'),
      err => {
        console.warn('Error starting camera', err);
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
    this.captureInProgress = true;
    const loadingPopup = this.dialog.open(CapturePopUpComponent);
    this.cameraPreview.capture().then(
      image => {
        console.log('Image captured');
        this.loadImageDescriptions(image, loadingPopup);
      },
      err => {
        console.warn('Failed to capture image', err);
        this.captureInProgress = false;
        loadingPopup.close();
        const errorMessage = this.i18n({ id: 'captureImageError', value: 'Unable to capture image' });
        this.dialog.open(ErrorPopUpComponent, { data: { message: errorMessage } });
      }
    );
  }

  loadImageDescriptions(image: Blob, loadingPopUp: MatDialogRef<CapturePopUpComponent>) {
    this.imageRecognitionService.loadDescriptions(image).then(
      (descriptions) => {
        if (descriptions.length > 0) {
          this.router.navigateByUrl(AppRoutes.Feedback, { state: { image, words: descriptions.map(d => d.description) } }).finally(
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
    const loadingPopup = this.dialog.open(CapturePopUpComponent);
    this.loadImageDescriptions(image, loadingPopup);
  }

  onSidenavClosed() {
    this.sidenavOpen = false;
  }
}
