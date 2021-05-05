import { Injectable } from "@angular/core";
import { IAnalyticsService } from "../analytics";

@Injectable()
export class MockAnalyticsService implements IAnalyticsService {
  public async logPageView(path: string, title: string) {
    console.log(`Logged page view: ${path} - ${title}`);
  }

  public async logButtonClick(buttonID: string) {
    console.log(`Logged button click: ${buttonID}`);
  }
}
