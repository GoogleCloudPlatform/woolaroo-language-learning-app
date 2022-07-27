const fs = require('fs');
const path = require('path');

const APP_SERVICE = process.argv[2];
const APP_YAML_PATH = process.argv[3];
// The time for all static assets max-age
const APP_CACHE_TIME = process.argv[4];
// the time for index.html to expire, generally this will be shorter than
// the static assets
const INDEX_CACHE_TIME = process.argv[5];
const DISPATCH_YAML_PATH = process.argv[6];
const PROD_URL = process.argv[7];
const STAGING_URL = process.argv[8];


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
    appYamlContent = appYamlContent.replace('$INDEX_CACHE', INDEX_CACHE_TIME);
    fs.writeFileSync(appYamlPath, appYamlContent);

    // Prepare the dispach.yaml
    const dispatchYamlPath = path.join(process.cwd(), DISPATCH_YAML_PATH);
    let dispatchYamlContent = fs.readFileSync(
        dispatchYamlPath, { encoding: 'utf-8' });

    dispatchYamlContent = dispatchYamlContent.replace('{{PROD_URL}}', PROD_URL);
    dispatchYamlContent = dispatchYamlContent
        .replace('{{STAGING_URL}}', STAGING_URL);

    fs.writeFileSync(dispatchYamlPath, dispatchYamlContent);

}
