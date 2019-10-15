const fs = require('fs');
const path = require('path');

const CORS_FILE_PATH = process.argv[2];
if(!CORS_FILE_PATH) {
    throw new Error('CORS file path not set');
}
const SERVER_ORIGIN = process.argv[3];
if(!SERVER_ORIGIN) {
    throw new Error('Server domain not set');
}

const corsConfig = [{
    "origin": [SERVER_ORIGIN],
    "responseHeader": ["Content-Type"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
}];

const configFilePath = path.join(process.cwd(), CORS_FILE_PATH);
fs.writeFileSync(configFilePath, JSON.stringify(corsConfig));


