import { AfterViewInit, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';
import { IImageRecognitionService, IMAGE_RECOGNITION_SERVICE } from 'services/image-recognition';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';
import { AppRoutes } from 'app/routes';
import { SessionService } from 'services/session';
import { addOpenedListener } from 'util/dialog';
import { ImageLoaderPageBase } from 'pages/capture/capture';

@Component({
  selector: 'app-page-photo-source',
  templateUrl: './photo-source.html',
  styleUrls: ['./photo-source.scss']
})
export class PhotoSourcePageComponent extends ImageLoaderPageBase implements AfterViewInit {
  constructor( router: Router,
               dialog: MatDialog,
               sessionService: SessionService,
               @Inject(IMAGE_RECOGNITION_SERVICE) imageRecognitionService: IImageRecognitionService,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService) {
    super(router, dialog, sessionService, imageRecognitionService);
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Photo Source');
  }

  onCaptureClick() {
    const loadingPopUp = this.dialog.open(LoadingPopUpComponent,
      { closeOnNavigation: false, disableClose: true, panelClass: 'loading-popup' });
    this.sessionService.currentSession.currentModal = loadingPopUp;
    loadingPopUp.beforeClosed().subscribe({
      complete: () => this.sessionService.currentSession.currentModal = null
    });
    addOpenedListener(loadingPopUp, () => this.router.navigateByUrl(AppRoutes.CaptureImage));
  }
}
