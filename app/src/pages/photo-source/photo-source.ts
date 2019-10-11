import { AfterViewInit, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { IAnalyticsService, ANALYTICS_SERVICE } from 'services/analytics';
import { IImageRecognitionService, IMAGE_RECOGNITION_SERVICE } from 'services/image-recognition';
import { LoadingPopUpComponent } from 'components/loading-popup/loading-popup';

@Component({
  selector: 'app-page-photo-source',
  templateUrl: './photo-source.html',
  styleUrls: ['./photo-source.scss']
})
export class PhotoSourcePageComponent implements AfterViewInit {
  constructor( private router: Router,
               private dialog: MatDialog,
               @Inject(ANALYTICS_SERVICE) private analyticsService: IAnalyticsService,
               @Inject(IMAGE_RECOGNITION_SERVICE) private imageRecognitionService: IImageRecognitionService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Photo Source');
  }

  onImageUploaded(image: Blob) {
    const loadingPopUp = this.dialog.open(LoadingPopUpComponent);
    this.imageRecognitionService.loadDescriptions(image).then(
      (descriptions) => {
        if (descriptions.length > 0) {
          this.router.navigateByUrl('/translate', { state: { image, words: descriptions.map(d => d.description) } }).finally(
            () => loadingPopUp.close()
          );
        } else {
          this.router.navigateByUrl('/translate/caption', { state: { image } }).finally(
            () => loadingPopUp.close()
          );
        }
      },
      (err) => {
        console.warn('Error loading image descriptions', err);
        loadingPopUp.close();
        this.router.navigateByUrl('/translate/caption', { state: { image } }).finally(
          () => loadingPopUp.close()
        );
      }
    );
  }

  onCaptureClick() {
    this.router.navigateByUrl('/capture');
  }
}
