import { Component, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { IAnalyticsService, ANALYTICS_SERVICE } from "services/analytics";
import { IFeedbackService, FEEDBACK_SERVICE } from "services/feedback";

@Component({
  selector: 'page-feedback',
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.scss']
})
export class FeedbackPage {
  public submittingForm:boolean = false;

  constructor( private router:Router,
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
    this.feedbackService.sendFeedback(form.value).then(
      () => console.log("Feedback submitted"),
      err => {
        console.warn("Failed submitting feedback", err);
      }
    ).finally(
      () => this.submittingForm = false
    );
  }
}
