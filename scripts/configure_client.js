const fs = require('fs');
const path = require('path');
const xml = require('xml-js');

let paramIndex = 2;
const CONFIG_FILE_PATH = process.argv[paramIndex++];
if(!CONFIG_FILE_PATH) {
    throw new Error('Config file path not set');
}
const API_URL = process.argv[paramIndex++];
if(!API_URL) {
    throw new Error('API URL not set');
}
const ASSETS_BASE_URL = process.argv[paramIndex++] || './';
const GOOGLE_API_KEY = process.argv[paramIndex++];
if(!GOOGLE_API_KEY) {
    throw new Error('Google API key not set');
}
const GOOGLE_TRACKER_ID = process.argv[paramIndex++];
const ENDANGERED_LANGUAGE = process.argv[paramIndex++];
if(!ENDANGERED_LANGUAGE) {
    throw new Error('Endangered language not set');
}

let TERMS_AND_CONDITIONS = process.argv[paramIndex++];
if(TERMS_AND_CONDITIONS) {
    TERMS_AND_CONDITIONS = TERMS_AND_CONDITIONS.trim();
}
const LANGUAGE_FILE_PATH = process.argv[paramIndex++];
if(TERMS_AND_CONDITIONS && !LANGUAGE_FILE_PATH) {
    throw new Error('Google API key not set');
}

let PARTNER_LOGO_URL = process.argv[paramIndex++];
if(PARTNER_LOGO_URL) {
    const partnerLogoPath = path.join(__dirname, `../client/src${PARTNER_LOGO_URL}`);
    if(!fs.existsSync(partnerLogoPath)) {
        PARTNER_LOGO_URL = '';
    }
}

const THEME_FILE_PATH = process.argv[paramIndex++];
const THEME = process.argv[paramIndex++];
if(THEME && !THEME_FILE_PATH) {
    throw new Error('Theme file path not set');
}

const configFilePath = path.join(process.cwd(), CONFIG_FILE_PATH);
let configContent =
`export const params = {
assetsBaseUrl: '${ASSETS_BASE_URL}',
googleApiKey: '${GOOGLE_API_KEY}',
googleTrackerId: '${GOOGLE_TRACKER_ID}',
apiUrl: '${API_URL}',
endangeredLanguage: '${ENDANGERED_LANGUAGE}'
termsAndConditionsEnabled: ${!!TERMS_AND_CONDITIONS}
};`;
fs.writeFileSync(configFilePath, configContent);

if(TERMS_AND_CONDITIONS) {
    const languageFilePath = path.join(process.cwd(), LANGUAGE_FILE_PATH);
    let languageFileContent = fs.readFileSync(languageFilePath, { encoding: 'utf-8' });
    // parse localization file XML
    const languageXML = xml.xml2js(languageFileContent);
    // find translation unit element
    const bodyElement = languageXML.elements[0].elements[0].elements[0];
    const unitElement = bodyElement.elements.find(el => el.attributes.id === 'termsAndPrivacyContent');
    const targetElement = unitElement.elements.find(el => el.name === 'target');
    // replace line breaks with <br /> tags (encoded as xlf)
    const lineBreakXML = xml.xml2js('<x id="LINE_BREAK" ctype="lb" equiv-text="&lt;br/&gt;"/>').elements[0];
    const termLines = TERMS_AND_CONDITIONS.replace('\r', '').split('\n');
    // replace terms and conditions
    targetElement.elements = [];
    for(let k = 0; k < termLines.length; k++) {
        targetElement.elements.push({ type: 'text', text: termLines[k] });
        if(k < termLines.length - 1) {
            targetElement.elements.push(lineBreakXML);
        }
    }
    console.log(targetElement);
    // rewrite file
    fs.writeFileSync(languageFilePath, xml.js2xml(languageXML, { spaces: 2 }));
}

if(THEME) {
    const themeFilePath = path.join(process.cwd(), THEME_FILE_PATH);
    let themeContent = `@import 'themes/${THEME}';`;
    fs.writeFileSync(themeFilePath, themeContent);
}
