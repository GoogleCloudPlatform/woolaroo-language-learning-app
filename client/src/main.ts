import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { getLogger, enableLogging } from './util/logging';

if (environment.production) {
  enableProdMode();
}
if (environment.loggingEnabled) {
  enableLogging();
}

const logger = getLogger('EndangeredLanguageService');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => logger.error(err));
