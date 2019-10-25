const fs = require('fs');
const path = require('path');

let paramIndex = 2;
const CONFIG_FILE_PATH = process.argv[paramIndex++];
if(!CONFIG_FILE_PATH) {
    throw new Error('Config file path not set');
}
const API_URL = process.argv[paramIndex++];
if(!API_URL) {
    throw new Error('API URL not set');
}
const ASSETS_BASE_URL = process.argv[paramIndex++] || './';
const GOOGLE_API_KEY = process.argv[paramIndex++];
if(!GOOGLE_API_KEY) {
    throw new Error('Google API key not set');
}
const GOOGLE_TRACKER_ID = process.argv[paramIndex++];
let PARTNER_LOGO_URL = process.argv[paramIndex++];
const THEME_FILE_PATH = process.argv[paramIndex++];
const THEME = process.argv[paramIndex++];
if(THEME && !THEME_FILE_PATH) {
    throw new Error('Theme file path not set');
}

if(PARTNER_LOGO_URL) {
    const partnerLogoPath = path.join(__dirname, `../client/src${PARTNER_LOGO_URL}`);
    if(!fs.existsSync(partnerLogoPath)) {
        PARTNER_LOGO_URL = '';
    }
}

const configFilePath = path.join(process.cwd(), CONFIG_FILE_PATH);
let configContent =
`export const params = {
assetsBaseUrl: '${ASSETS_BASE_URL}',
googleApiKey: '${GOOGLE_API_KEY}',
googleTrackerId: '${GOOGLE_TRACKER_ID}',
apiUrl: '${API_URL}',
partnerLogoUrl: '${PARTNER_LOGO_URL}'
};`;
fs.writeFileSync(configFilePath, configContent);

if(THEME) {
    const themeFilePath = path.join(process.cwd(), THEME_FILE_PATH);
    let themeContent = `@import 'themes/${THEME}';`;
    fs.writeFileSync(themeFilePath, themeContent);
}
