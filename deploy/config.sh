#!/usr/bin/env bash

VALUES_CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

GCP_ADMIN_PROJECT_ID="<GCP_ADMIN_PROJECT_ID>" # the admin GCP project name, i.e. woolaroo-admin
GCP_LANGUAGE_PROJECT_ID="<GCP_LANGUAGE_PROJECT_ID>" # the language GCP project ID, i.e. woolaroo-calabrian-greek
GCP_BILLING_ACCOUNT_ID="<GCP_BILLING_ACCOUNT_ID>" # the GCP billing account ID
GCP_ORG_ID="<GCP_ORG_ID>" # the GCP organization ID
GCP_REGION="us-central" # the GCP region. Do not change unless you have a good reason
GCP_FOLDER_ID="<GCP_FOLDER_ID>" # the GCP folder ID

CLIENT_ID_FILE="<CLIENT_ID_FILE_PATH>" # the client ID from the admin GCP project

GIT_REPOSITORY="https://github.com/GoogleCloudPlatform/barnard-language-learning-app.git" # the GIT repository. Do not change unless you have a good reason

TRANSLATION_SPREADSHEET_ID="" # the ID of the spreadsheet with translations, if there is one. Leave empty otherwise.

LANGUAGE_NAME="<LANGUAGE_NAME>" # the language name, i.e. Bielarusian
