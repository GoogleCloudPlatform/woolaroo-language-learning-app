#!/usr/bin/env bash
set -euxo pipefail

if ! [ -x "$(command -v gcloud)" ]; then
  echo 'Error: gcloud is not installed.' >&2
  exit 1
fi

CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "${CURRENT_PATH}/config.sh"

gcloud auth revoke
gcloud auth login

if [ -z "${GCP_FOLDER_ID}" ]
then
  if [ -z "${GCP_ORG_ID}" ]
  then
    gcloud projects create ${GCP_ADMIN_PROJECT_ID} \
      --name ${GCP_ADMIN_PROJECT_ID} --set-as-default
  else
    gcloud projects create ${GCP_ADMIN_PROJECT_ID} \
      --name ${GCP_ADMIN_PROJECT_ID} --set-as-default \
      --organization ${GCP_ORG_ID}
  fi
else
  gcloud projects create ${GCP_ADMIN_PROJECT_ID} \
    --name ${GCP_ADMIN_PROJECT_ID} --set-as-default \
    --folder ${GCP_FOLDER_ID}
fi

gcloud projects create ${GCP_ADMIN_PROJECT_NAME} \
  --name ${GCP_ADMIN_PROJECT_NAME} --set-as-default \
  --folder ${GCP_FOLDER_ID}

gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable cloudbilling.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable serviceusage.googleapis.com
gcloud services enable firebase.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable appengine.googleapis.com
gcloud services enable firebasehosting.googleapis.com
gcloud services enable identitytoolkit.googleapis.com
gcloud services enable sheets.googleapis.com
gcloud services enable vision.googleapis.com
gcloud services enable cloudbuild.googleapis.com
