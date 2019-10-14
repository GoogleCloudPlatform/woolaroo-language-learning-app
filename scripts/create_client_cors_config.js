const fs = require('fs');
const path = require('path');

const SERVER_ORIGIN = process.argv[2];
if(!SERVER_ORIGIN) {
    throw new Error('Server domain not set');
}

const corsConfig = [{
    "origin": [SERVER_ORIGIN],
    "responseHeader": ["Content-Type"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
}];

const configFilePath = path.join(__dirname, '../client_cors.json');
fs.writeFileSync(configFilePath, JSON.stringify(corsConfig));


