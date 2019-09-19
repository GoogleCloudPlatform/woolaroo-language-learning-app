const fs = require('fs');
const path = require('path');

const STATE_BUCKET_NAME = process.argv[2];
if(!STATE_BUCKET_NAME) {
    throw new Error('Terraform state bucket name not set');
}

const configContent =
`terraform {
  backend "gcs" {
    bucket  = "${STATE_BUCKET_NAME}"
    prefix  = "state"
  }
}`;

const configFilePath = path.join(__dirname, '../terraform/override.tf');
fs.writeFileSync(configFilePath, configContent);
