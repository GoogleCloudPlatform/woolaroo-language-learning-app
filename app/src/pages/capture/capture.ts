import {Component, Inject, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { CameraPreviewComponent, CameraPreviewStatus } from "components/camera-preview/camera-preview";
import { ErrorPopUpComponent } from 'components/error-popup/error-popup';
import { ANALYTICS_SERVICE, IAnalyticsService } from "services/analytics";

@Component({
  selector: 'page-capture',
  templateUrl: 'capture.html',
  styleUrls: ['./capture.scss']
})
export class CapturePage {
  @ViewChild(CameraPreviewComponent, {static: false})
  private cameraPreview:CameraPreviewComponent|null = null;
  public captureInProgress:boolean = false;

  constructor( private router:Router,
               private dialog:MatDialog,
               @Inject(ANALYTICS_SERVICE) private analyticsService:IAnalyticsService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Capture');
    this.cameraPreview!.start().then(
      () => console.log("Camera started"),
      err => {
        console.warn("Error starting camera", err);
        const errorDialog = this.dialog.open(ErrorPopUpComponent, { data: { message: 'Unable to start camera' } });
        errorDialog.afterClosed().subscribe(() => {
          this.router.navigate(["/"], { replaceUrl: true });
        });
      }
    );
  }

  onCaptureClick() {
    if(this.cameraPreview!.status !== CameraPreviewStatus.Started) {
      return;
    }
    this.captureInProgress = true;
    this.cameraPreview!.capture().then(
      image => {
        console.log("Image captured");
        this.router.navigate(['/translate'], { state: {capturedImage: image} });
      },
      err => {
        console.warn('Failed to capture image', err);
        this.captureInProgress = false;
        this.onCaptureError(err);
      }
    )
  }

  onCaptureError(err:any) {
    // TODO
  }
}
