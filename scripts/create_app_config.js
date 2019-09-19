const fs = require('fs');
const path = require('path');

const GOOGLE_API_KEY = process.argv[2];
if(!GOOGLE_API_KEY) {
    throw new Error('Google API key not set');
}

const configContent =
`import { mergeConfigurations } from 'util/config';
import { environment as baseEnvironment } from './environment.base';
export const environment =  mergeConfigurations(baseEnvironment, {
  production: true,
  apiKey: '${GOOGLE_API_KEY}',
});`;

const configFilePath = path.join(__dirname, '../app/src/environments/environment.prod.ts');
fs.writeFileSync(configFilePath, configContent);
