import { Component, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { IAnalyticsService, ANALYTICS_SERVICE } from "services/analytics";
import { IFeedbackService, FEEDBACK_SERVICE } from "services/feedback";
import { LoadingPopUpComponent } from "components/loading-popup/loading-popup";

@Component({
  selector: 'page-feedback',
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.scss']
})
export class FeedbackPage {
  public submittingForm:boolean = false;

  constructor( private router:Router,
               private location:Location,
               private dialog:MatDialog,
               @Inject(FEEDBACK_SERVICE) private feedbackService:IFeedbackService,
               @Inject(ANALYTICS_SERVICE) private analyticsService:IAnalyticsService ) {
  }

  ngAfterViewInit() {
    this.analyticsService.logPageView(this.router.url, 'Feedback');
  }

  onFormSubmit(ev:Event, form:NgForm) {
    if(!form.valid) {
      return;
    }
    this.submittingForm = true;
    const loadingPopup = this.dialog.open(LoadingPopUpComponent);
    this.feedbackService.sendFeedback(form.value).then(
      () => {
        console.log("Feedback submitted");
        this.location.back();
      },
      err => {
        console.warn("Failed submitting feedback", err);
      }
    ).finally(
      () => {
        this.submittingForm = false;
        loadingPopup.close();
      }
    );
  }
}
