#!/usr/bin/env bash

VALUES_CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

GCP_ADMIN_PROJECT_NAME="<GCP_ADMIN_PROJECT_NAME>" # the admin GCP project name, i.e. woolaroo-admin
GCP_LANGUAGE_PROJECT_ID="<GCP_LANGUAGE_PROJECT_ID>" # the language GCP project ID, i.e. woolaroo-griko-calabria
GCP_BILLING_ACCOUNT_ID="<GCP_BILLING_ACCOUNT_ID>" # the GCP billing account ID
GCP_ORG_ID="433637338589" # the GCP organization ID
GCP_REGION="us-central" # the GCP region. Do not change
GCP_FOLDER_ID="396521612403" # the GCP folder ID

CLIENT_ID_FILE="<CLIENT_ID_FILE_PATH>" # the client ID from the admin terraform project

GIT_REPOSITORY="https://github.com/GoogleCloudPlatform/barnard-language-learning-app.git" # the GIT repository. Do not change
