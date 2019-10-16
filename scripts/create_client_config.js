const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

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
if(!THEME_FILE_PATH) {
    throw new Error('Theme file path not set');
}
const THEME = process.argv[paramIndex++] || 'pink';

if(PARTNER_LOGO_URL) {
    let destLogoFileUrl = '/assets/img/partner-logo.png';
    downloadFile(PARTNER_LOGO_URL, `../client/src${destLogoFileUrl}`).then(
        () => {
            PARTNER_LOGO_URL = destLogoFileUrl;
            writeConfig();
        },
        (err) => {
            console.log('Error downloading partner logo', err);
            PARTNER_LOGO_URL = '';
            writeConfig();
        }
    );
}


function writeConfig() {
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

    const themeFilePath = path.join(process.cwd(), THEME_FILE_PATH);
    let themeContent = `@import 'theme-${THEME}';`;
    fs.writeFileSync(themeFilePath, themeContent);
}

async function downloadFile(url, destFilePath) {
    return await new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            if(res.statusCode !== 200) {
                reject(new Error(`Error downloading file: ${res.statusCode}`));
                return;
            }
            const contentType = res.headers['content-type'];
            if(!contentType.startsWith('image/')) {
                reject(new Error('Downloaded file is not an image'));
                return;
            }
            const data = [];
            res.on('error', function(err) {
                reject(err);
            });
            res.on('data', function(chunk) {
                data.push(Buffer.from(chunk, 'binary'));
            });
            res.on('end', function() {
                fs.writeFileSync(destFilePath, Buffer.concat(data));
                resolve();
            });
        });
    });
}