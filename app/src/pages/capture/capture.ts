import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CameraPreviewComponent, CameraPreviewStatus } from 'components/camera-preview/camera-preview';
import { ErrorPopUpComponent } from 'components/error-popup/error-popup';
import { ANALYTICS_SERVICE, IAnalyticsService } from 'services/analytics';

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
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Capture');
    if (!this.cameraPreview) {
      console.error('Camera preview not found');
      this.router.navigateByUrl('/', { replaceUrl: true });
      return;
    }
    this.cameraPreview.start().then(
      () => console.log('Camera started'),
      err => {
        console.warn('Error starting camera', err);
        const errorDialog = this.dialog.open(ErrorPopUpComponent, { data: { message: 'Unable to start camera' } });
        errorDialog.afterClosed().subscribe(() => {
          this.router.navigateByUrl('/', { replaceUrl: true });
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
        this.router.navigate(['/translate'], { state: {capturedImage: image} });
      },
      err => {
        console.warn('Failed to capture image', err);
        this.captureInProgress = false;
        this.onCaptureError(err);
      }
    );
  }

  onCaptureError(err: any) {
    // TODO
  }

  onOpenMenuClick() {
    this.sidenavOpen = !this.sidenavOpen;
  }

  onSidenavClosed() {
    this.sidenavOpen = false;
  }
}
