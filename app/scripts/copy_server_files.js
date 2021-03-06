const fs = require('fs');
const path = require('path');

let argIndex = 2;
const INDEX_FILE = process.argv[argIndex++];
if(!INDEX_FILE) {
    throw new Error('Index file path not set');
}
const DEST_INDEX_FILE = process.argv[argIndex++];
if(!DEST_INDEX_FILE) {
    throw new Error('Destination index file path not set');
}
const SERVICE_WORKER_FILE = process.argv[argIndex++];
if(!SERVICE_WORKER_FILE) {
    throw new Error('Service worker file path not set');
}
const SERVICE_WORKER_DATA_FILE = process.argv[argIndex++];
if(!SERVICE_WORKER_DATA_FILE) {
    throw new Error('Service worker data file path not set');
}
const WEBMANIFEST_FILE = process.argv[argIndex++];
if(!WEBMANIFEST_FILE) {
    throw new Error('Webmanifest file path not set');
}
const FAVICON_FILE = process.argv[argIndex++];
if(!FAVICON_FILE) {
    throw new Error('Favicon file path not set');
}
const CDN_BASE_URL = process.argv[argIndex++];
if(!CDN_BASE_URL) {
    throw new Error('CDN base URL not set');
}
const SERVICE_WORKER_DEST_DIR = process.argv[argIndex++];
if(!SERVICE_WORKER_DEST_DIR) {
    throw new Error('Service worker destination path not set');
}

fs.copyFileSync(path.join(process.cwd(), INDEX_FILE), path.join(process.cwd(), DEST_INDEX_FILE));
const serviceWorkerDestDir = path.join(process.cwd(), SERVICE_WORKER_DEST_DIR);
try {
    fs.mkdirSync(serviceWorkerDestDir, {recursive: true});
} catch(err) {
    console.warn("Error creating service worker dir", err);
}
fs.copyFileSync(path.join(process.cwd(), SERVICE_WORKER_FILE), path.join(serviceWorkerDestDir, path.basename(SERVICE_WORKER_FILE)));
fs.copyFileSync(path.join(process.cwd(), FAVICON_FILE), path.join(serviceWorkerDestDir, path.basename(FAVICON_FILE)));

let serviceWorkerData = JSON.parse(fs.readFileSync(path.join(process.cwd(), SERVICE_WORKER_DATA_FILE), 'utf-8'));
for(const group of serviceWorkerData.assetGroups) {
    for(let k = 0; k < group.urls.length; k++) {
        let url = group.urls[k];
        if(url !== '/index.html' && url !== '/favicon.ico') {
            group.urls[k] = getAssetURL(url);
        }
    }
}
const newHashTable = {};
for(const url of Object.keys(serviceWorkerData.hashTable)) {
    if(url !== '/index.html' && url !== '/favicon.ico') {
        newHashTable[getAssetURL(url)] = serviceWorkerData.hashTable[url];
    } else {
        newHashTable[url] = serviceWorkerData.hashTable[url];
    }
}
serviceWorkerData.hashTable = newHashTable;
fs.writeFileSync(path.join(serviceWorkerDestDir, path.basename(SERVICE_WORKER_DATA_FILE)), JSON.stringify(serviceWorkerData));

let manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), WEBMANIFEST_FILE), 'utf-8'));
for(const icon of manifest.icons) {
    icon.src = getAssetURL(icon.src);
}
fs.writeFileSync(path.join(serviceWorkerDestDir, path.basename(WEBMANIFEST_FILE)), JSON.stringify(manifest));

function getAssetURL(url) {
    // remove starting slash - need URL to be relative to cdn base URL
    if(url && url[0] === '/') {
        url = url.slice(1);
    }
    return (new URL(url, CDN_BASE_URL)).toString();
}
