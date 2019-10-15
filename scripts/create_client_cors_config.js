const fs = require('fs');
const path = require('path');

const CORS_FILE_PATH = process.argv[2];
if(!CORS_FILE_PATH) {
    throw new Error('CORS file path not set');
}
const APP_URL_1 = process.argv[3];
const APP_URL_2 = process.argv[4];
if(!APP_URL_1 && !APP_URL_2) {
    throw new Error('App URL not set');
}

const origins = [];
if(APP_URL_1) {
    origins.push(APP_URL_1);
}
if(APP_URL_2) {
    origins.push(APP_URL_2);
}

const corsConfig = [{
    "origin": origins,
    "responseHeader": ["Content-Type"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
}];

const configFilePath = path.join(process.cwd(), CORS_FILE_PATH);
fs.writeFileSync(configFilePath, JSON.stringify(corsConfig));


