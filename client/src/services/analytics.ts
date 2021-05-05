import { InjectionToken } from "@angular/core";

export interface IAnalyticsService {
  logPageView(path: string, title: string):void;
  logButtonClick(buttonID: string):void;
}

export const ANALYTICS_SERVICE = new InjectionToken<IAnalyticsService>("Analytics service");
export const ANALYTICS_CONFIG = new InjectionToken<any>("Analytics services config");
