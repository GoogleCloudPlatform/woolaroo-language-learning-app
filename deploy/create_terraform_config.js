const fs = require('fs');
const path = require('path');

const OVERRIDES_FILE_PATH = process.argv[2];
if(!OVERRIDES_FILE_PATH) {
    throw new Error('Overrides file path not set');
}
const STATE_BUCKET_NAME = process.argv[3];
if(!STATE_BUCKET_NAME) {
    throw new Error('Terraform state bucket name not set');
}
const STATE_BUCKET_PATH = process.argv[4] || 'state';

const configContent =
`terraform {
  backend "gcs" {
    bucket  = "${STATE_BUCKET_NAME}"
    prefix  = "${STATE_BUCKET_PATH}"
  }
}`;

const configFilePath = path.join(process.cwd(), OVERRIDES_FILE_PATH);
fs.writeFileSync(configFilePath, configContent);
