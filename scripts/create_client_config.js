const fs = require('fs');
const path = require('path');

const ASSETS_BASE_URL = process.argv[2] || './';
const GOOGLE_API_KEY = process.argv[3];
if(!GOOGLE_API_KEY) {
    throw new Error('Google API key not set');
}
const THEME = process.argv[4] || 'pink';

const configFilePath = path.join(__dirname, '../client/src/environments/environment.prod.ts');
let configContent = fs.readFileSync(configFilePath, { 'encoding': 'utf-8' });
configContent = configContent.replace('<GOOGLE_API_KEY>', GOOGLE_API_KEY);
configContent = configContent.replace('<ASSETS_BASE_URL>', ASSETS_BASE_URL);
fs.writeFileSync(configFilePath, configContent);

const themeFilePath = path.join(__dirname, '../client/src/style/theme.scss');
let themeContent = `@import 'theme-${THEME}';`;
fs.writeFileSync(themeFilePath, themeContent);


