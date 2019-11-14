const fs = require('fs');
const path = require('path');

const INDEX_FILE = process.argv[2];
if(!INDEX_FILE) {
    throw new Error('Index file path not set');
}
const DEST_INDEX_FILE = process.argv[3];
if(!DEST_INDEX_FILE) {
    throw new Error('Destination index file path not set');
}
const SERVICE_WORKER_FILE = process.argv[4];
if(!SERVICE_WORKER_FILE) {
    throw new Error('Service worker file path not set');
}
const SERVICE_WORKER_DATA_FILE = process.argv[5];
if(!SERVICE_WORKER_DATA_FILE) {
    throw new Error('Service worker data file path not set');
}
const WEBMANIFEST_FILE = process.argv[6];
if(!WEBMANIFEST_FILE) {
    throw new Error('Webmanifest file path not set');
}
const SERVICE_WORKER_DEST_DIR = process.argv[7];
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
fs.copyFileSync(path.join(process.cwd(), SERVICE_WORKER_DATA_FILE), path.join(serviceWorkerDestDir, path.basename(SERVICE_WORKER_DATA_FILE)));
fs.copyFileSync(path.join(process.cwd(), WEBMANIFEST_FILE), path.join(serviceWorkerDestDir, path.basename(WEBMANIFEST_FILE)));