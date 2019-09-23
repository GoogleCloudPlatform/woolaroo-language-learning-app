const fs = require('fs');
const path = require('path');

const GOOGLE_API_KEY = process.argv[2];
if(!GOOGLE_API_KEY) {
    throw new Error('Google API key not set');
}
const THEME = process.argv[3] || 'pink';

const configFilePath = path.join(__dirname, '../app/src/environments/environment.prod.ts');
let configContent = fs.readFileSync(configFilePath, { 'encoding': 'utf-8' });
configContent = configContent.replace('<GOOGLE_API_KEY>', GOOGLE_API_KEY);
fs.writeFileSync(configFilePath, configContent);

const themeFilePath = path.join(__dirname, '../app/src/style/theme.scss');
let themeContent = `@import 'theme-${THEME}';`;
fs.writeFileSync(themeFilePath, themeContent);


