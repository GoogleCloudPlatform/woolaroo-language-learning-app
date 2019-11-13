#!/usr/bin/env bash

VALUES_CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

GCP_LANGUAGE_PROJECT_NAME="<GCP_LANGUAGE_PROJECT_NAME>" # language GCP project name, i.e. woolaroo-griko-calabria
GCP_BILLING_ACCOUNT_ID="<GCP_BILLING_ACCOUNT_ID>" # the GCP billing account ID
GCP_ORG_ID="433637338589" # the GCP organization ID
GCP_REGION="us-central" # the GCP region
GCP_FOLDER_ID="396521612403" # the GCP folder ID

BUCKET_PROJECT_ID="woolaroo-admin-terraform-test" # the GCP project ID of the admin project
BUCKET_STATE_NAME="woolaroo-terraform-bucket-test-mic" # the bucket in the admin project for terraform state

CLIENT_ID_FILE="<LOCAL_PATH_CLIENT_ID>" # the client ID from the admin terraform project

GIT_REPOSITORY="https://github.com/GoogleCloudPlatform/barnard-language-learning-app.git"
