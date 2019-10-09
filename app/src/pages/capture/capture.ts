import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CameraPreviewComponent, CameraPreviewStatus } from 'components/camera-preview/camera-preview';
import { ErrorPopUpComponent } from 'components/error-popup/error-popup';
import { ANALYTICS_SERVICE, IAnalyticsService } from 'services/analytics';
import { I18n } from '@ngx-translate/i18n-polyfill';

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
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService,
               private i18n: I18n) {
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
    }
    if (this.cameraPreview.status !== CameraPreviewStatus.Started) {
      return;
    }
    this.captureInProgress = true;
    this.cameraPreview.capture().then(
      image => {
        console.log('Image captured');
        this.router.navigateByUrl('/translate', { state: { image } });
      },
      err => {
        console.warn('Failed to capture image', err);
        this.captureInProgress = false;
        const errorMessage = this.i18n({ id: 'captureImageError', value: 'Unable to capture image' });
        this.dialog.open(ErrorPopUpComponent, { data: { message: errorMessage } });
      }
    );
  }

  onOpenMenuClick() {
    this.sidenavOpen = !this.sidenavOpen;
  }

  onImageUploaded(image: Blob) {
    this.router.navigateByUrl('/translate', { state: { image } });
  }

  onSidenavClosed() {
    this.sidenavOpen = false;
  }
}
