# Steps to deploy wizard and app

## Configure Admin GCP project.

You can skip if you already have one.

1. In `config.sh`, configure:
  - `GCP_ADMIN_PROJECT_ID` with the unique GCP project ID for admin project.
    If this is not unique, the script will generate an error.
  - `GCP_BILLING_ACCOUNT_ID` with the billing account ID to associate.
  If this is not unique, the script will generate an error.
2. Run `create_admin_project.sh` to create the GCP admin project
3. Create an OAuth client ID (Other) in the admin project.
4.  Download the secret and store it locally.

## Configure a Language project.

1. In `config.sh`, configure:
  - `CLIENT_ID_FILE` with the local path to the secret
  - `GCP_LANGUAGE_PROJECT_ID` with the unique GCP project ID for language project.
    If this is not unique, the script will generate an error.
  - `LANGUAGE_NAME` with the name of the language
  - `TRANSLATION_SPREADSHEET_ID` with the ID of the spreadsheet with the
    translations. Optional.
  - `GCP_BILLING_ACCOUNT_ID` with the billing account ID to associate.
  - `GCP_ORG_ID` or `GCP_FOLDER_ID`. Both are optional.
    If `GCP_FOLDER_ID` is not empty, the project will be created under that folder.
    If `GCP_FOLDER_ID` is empty and `GCP_ORG_ID` is not empty, the project will
    be created under the org node.
    Otherwise the project will not be attached to a parent.
2. Run `./create_project.sh` to create the GCP language projects or
  `./update_project.sh` to update it. Follow instructions.
