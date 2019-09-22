const fs = require('fs');
const path = require('path');

const GOOGLE_API_KEY = process.argv[2];
if(!GOOGLE_API_KEY) {
    throw new Error('Google API key not set');
}

const configFilePath = path.join(__dirname, '../app/src/environments/environment.prod.ts');
let configContent = fs.readFileSync(configFilePath);
configContent.replace('<GOOGLE_API_KEY>', GOOGLE_API_KEY);

fs.writeFileSync(configFilePath, configContent);
