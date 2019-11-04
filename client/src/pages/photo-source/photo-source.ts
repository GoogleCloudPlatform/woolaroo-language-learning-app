import { AfterViewInit, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogState } from '@angular/material';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';
import { IImageRecognitionService, IMAGE_RECOGNITION_SERVICE } from 'services/image-recognition';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';
import { AppRoutes } from 'app/routes';
import { SessionService } from 'services/session';

@Component({
  selector: 'app-page-photo-source',
  templateUrl: './photo-source.html',
  styleUrls: ['./photo-source.scss']
})
export class PhotoSourcePageComponent implements AfterViewInit {
  constructor( private router: Router,
               private dialog: MatDialog,
               private sessionService: SessionService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService,
               @Inject(IMAGE_RECOGNITION_SERVICE) private imageRecognitionService: IImageRecognitionService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Photo Source');
  }

  onImageUploaded(image: Blob) {
    const loadingPopUp = this.dialog.open(LoadingPopUpComponent,
      { closeOnNavigation: false, disableClose: true, panelClass: 'loading-popup' });
    this.sessionService.currentSession.currentModal = loadingPopUp;
    loadingPopUp.beforeClosed().subscribe({
      complete: () => this.sessionService.currentSession.currentModal = null
    });
    loadingPopUp.afterOpened().subscribe({
      complete: () => {
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
            this.router.navigateByUrl(AppRoutes.CaptionImage, { state: { image } }).finally(
              () => loadingPopUp.close()
            );
          }
        );
      }
    });
  }

  onCaptureClick() {
    const loadingPopUp = this.dialog.open(LoadingPopUpComponent,
      { closeOnNavigation: false, disableClose: true, panelClass: 'loading-popup' });
    this.sessionService.currentSession.currentModal = loadingPopUp;
    loadingPopUp.beforeClosed().subscribe({
      complete: () => this.sessionService.currentSession.currentModal = null
    });
    let opened = false;
    loadingPopUp.afterOpened().subscribe({
      complete: () => {
        if (!opened) {
          opened = true;
          this.router.navigateByUrl(AppRoutes.CaptureImage);
        }
      }
    });
    // HACK: afterOpened not firing on some platforms (iPhone 7+ Safari)
    // Force navigation
    setTimeout(() => {
      if (!opened) {
        opened = true;
        this.router.navigateByUrl(AppRoutes.CaptureImage);
      }
    }, 1000);
  }
}
