const fs = require('fs');
const path = require('path');

const APP_SERVICE = process.argv[2];
const APP_YAML_PATH = process.argv[3];
const APP_CACHE_TIME = process.argv[4];

if (!APP_YAML_PATH) {
    throw new Error('Config file path not set');
}

if (!APP_CACHE_TIME) {
    throw new Error('App cache time is not set, should be 2d or similar');
}

if (APP_SERVICE) {
    const appYamlPath = path.join(process.cwd(), APP_YAML_PATH);
    let appYamlContent = fs.readFileSync(appYamlPath, { encoding: 'utf-8' });
    appYamlContent = appYamlContent.replace('$SERVICE', APP_SERVICE);
    appYamlContent = appYamlContent.replace('$CACHE', APP_CACHE_TIME);
    fs.writeFileSync(appYamlPath, appYamlContent);
}
