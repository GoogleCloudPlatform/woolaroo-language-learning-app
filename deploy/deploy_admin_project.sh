#!/usr/bin/env bash
set -euxo pipefail

if ! [ -x "$(command -v gcloud)" ]; then
  echo 'Error: gcloud is not installed.' >&2
  exit 1
fi

CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "${CURRENT_PATH}/config.sh"

gcloud projects create ${GCP_ADMIN_PROJECT_NAME} \
  --name ${GCP_ADMIN_PROJECT_NAME} --set-as-default \
  --folder ${GCP_FOLDER_ID}

gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable cloudbilling.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable serviceusage.googleapis.com
gcloud services enable firebase.googleapis.com
gcloud services enable credentials.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable appengine.googleapis.com
gcloud services enable firebasehosting.googleapis.com

# create client ID manually, download it and save the path in CLIENT_ID_FILE
