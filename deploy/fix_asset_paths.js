// Corrects the URL of the PWA webmanifest file, current an issue with @angular/pwa
// (https://github.com/angular/angular-cli/issues/12322)
const fs = require('fs');
const path = require('path');

const INDEX_PATH = process.argv[2];
if(!INDEX_PATH) {
    throw new Error('Index file path not set');
}
const ASSET_BASE_URL = process.argv[3];
if(!ASSET_BASE_URL) {
    throw new Error('Asset base URL not set');
}

const indexFilePath = path.join(process.cwd(), INDEX_PATH);
let indexContent = fs.readFileSync(indexFilePath, { 'encoding': 'utf-8' });
indexContent = indexContent.replace('href="manifest.webmanifest"', `href="${ASSET_BASE_URL}/manifest.webmanifest"`);
fs.writeFileSync(indexFilePath, indexContent);