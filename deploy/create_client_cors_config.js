const fs = require('fs');
const path = require('path');

const CORS_FILE_PATH = process.argv[2];
if(!CORS_FILE_PATH) {
    throw new Error('CORS file path not set');
}
const PROJECT_ID = process.argv[3];
if(!PROJECT_ID) {
    throw new Error('Project ID not set');
}
const APP_SERVICE = process.argv[4];
const APP_URL = process.argv[5];

const origins = [];
origins.push(APP_SERVICE ? `https://${APP_SERVICE}-dot-${PROJECT_ID}.appspot.com` : `https://${PROJECT_ID}.appspot.com`);
if(APP_URL) {
    origins.push(APP_URL);
}

const corsConfig = [{
    "origin": origins,
    "responseHeader": ["Content-Type"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
}];

const configFilePath = path.join(process.cwd(), CORS_FILE_PATH);
fs.writeFileSync(configFilePath, JSON.stringify(corsConfig));


