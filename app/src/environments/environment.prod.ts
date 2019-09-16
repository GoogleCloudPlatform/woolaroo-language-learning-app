import { mergeConfigurations } from "util/config";
import { environment as baseEnvironment } from './environment';

export const environment =  mergeConfigurations(baseEnvironment, {
  production: true
});
