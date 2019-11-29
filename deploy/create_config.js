const fs = require('fs');
const path = require('path');

const OVERRIDES_FILE_PATH = '../src/config.json'
if(!OVERRIDES_FILE_PATH) {
    throw new Error('Overrides file path not set');
}

const API_KEY = process.argv[1];
const PROEJECT_ID = process.argv[2];
const PROJECT_NUMBER = process.argv[3];
const APP_ID = process.argv[4];

const configContent = 
`{
  "firebase_config" : {   
    "apiKey": "${API_KEY}",
    "authDomain": "${PROEJECT_ID}.firebaseapp.com",
    "databaseURL": "https://${PROEJECT_ID}.firebaseio.com",
    "projectId": "${PROEJECT_ID}",
    "storageBucket": "${PROEJECT_ID}.appspot.com",
    "messagingSenderId": "${PROJECT_NUMBER}",
    "appId": "${APP_ID}"}
}`;

const configFilePath = path.join(process.cwd(), OVERRIDES_FILE_PATH);
fs.writeFileSync(configFilePath, configContent);
