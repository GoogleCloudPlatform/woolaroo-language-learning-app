const fs = require('fs');
const path = require('path');

const APP_SERVICE = process.argv[2];
const APP_YAML_PATH = process.argv[3];
if(!APP_YAML_PATH) {
    throw new Error('Config file path not set');
}

if(APP_SERVICE) {
    const appYamlPath = path.join(process.cwd(), APP_YAML_PATH);
    let appYamlContent = fs.readFileSync(appYamlPath, {encoding: 'utf-8'});
    appYamlContent += `\n\nservice: ${APP_SERVICE}`;
    fs.writeFileSync(appYamlPath, appYamlContent);
}
