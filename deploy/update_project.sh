#!/usr/bin/env bash
# Prerequisites: jq, firebase, gcloud, npm are installed
set -euxo pipefail

if ! [ -x "$(command -v firebase)" ]; then
  echo 'Error: firebase is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v jq)" ]; then
  echo 'Error: jq is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v gcloud)" ]; then
  echo 'Error: gcloud is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: npm is not installed.' >&2
  exit 1
fi

gcloud auth revoke
firebase logout

CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "${CURRENT_PATH}/./config.sh"

if [ -d "${CURRENT_PATH}/barnard-language-learning-app" ];
  then rm -Rf ${CURRENT_PATH}/barnard-language-learning-app; fi

gcloud auth login
gcloud components update

PROJECT_ID=${GCP_LANGUAGE_PROJECT_ID}

gcloud config set project ${PROJECT_ID}

gcloud beta billing projects link ${PROJECT_ID} \
  --billing-account ${GCP_BILLING_ACCOUNT_ID}

gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable cloudbilling.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable serviceusage.googleapis.com
gcloud services enable firebase.googleapis.com
# gcloud services enable credentials.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable appengine.googleapis.com
gcloud services enable firebasehosting.googleapis.com
gcloud services enable sheets.googleapis.com
gcloud services enable vision.googleapis.com
gcloud services enable cloudbuild.googleapis.com


gcloud auth application-default login --client-id-file=$CLIENT_ID_FILE \
  --scopes="https://www.googleapis.com/auth/cloud-platform, https://www.googleapis.com/auth/firebase"

BEARER_ACCESS_TOKEN="$(gcloud auth application-default print-access-token)"

firebase login

curl --request POST -H "Authorization: Bearer $BEARER_ACCESS_TOKEN" \
  "https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}:addFirebase"
sleep 20
curl --request POST -H "Authorization: Bearer $BEARER_ACCESS_TOKEN" \
  "https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/defaultLocation:finalize" \
  --header "Content-Type: application/json" \
  --data '{"locationId":"us-central"}'

read -p "Visit \
  https://firebase.corp.google.com/u/0/project/${PROJECT_ID}/database/firestore/indexes \
  to create the database if you haven't already. Choose start in test mode. \
  Then come back here and press [Enter] to continue ..."

BUCKET_NAME=${PROJECT_ID}.appspot.com
git clone $GIT_REPOSITORY
cd ${CURRENT_PATH}/barnard-language-learning-app

firebase use ${PROJECT_ID}
sed -i "" -e "s/barnard-project/${PROJECT_ID}/g" .firebaserc
sed -i "" -e "s/barnard-project/${PROJECT_ID}/g" ./src/utils/ApiUtils.js

# Initiate firestore & storage & functions
firebase init firestore
firebase init storage
firebase init functions

cd  ./functions
npm install
firebase deploy --only functions

RESPONSE_GET=$(curl \
  -X GET -H "Authorization: Bearer $BEARER_ACCESS_TOKEN" \
  https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps)

APP_ID="$(echo $RESPONSE_GET | jq '.apps[0] .appId' | sed 's/\"//g')"
echo $APP_ID

if [ "${APP_ID}" == "null" ] || [ -z "${APP_ID}" ]
  then
  RESPONSE_POST=$(curl \
    -X POST -H "Authorization: Bearer $BEARER_ACCESS_TOKEN" \
    https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps \
    --header "Content-Type: application/json" \
    --data '{"displayName": "'${PROJECT_ID}'"}')

  echo $RESPONSE_POST

  sleep 10

  read -p "Add Hosting URL to the app visiting \
    https://firebase.corp.google.com/u/0/project/${PROJECT_ID}/settings/general/web .\
    Then come back here and press [Enter] to continue..."

  RESPONSE_GET=$(curl \
    -X GET -H "Authorization: Bearer $BEARER_ACCESS_TOKEN" \
    https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps)

  APP_ID="$(echo $RESPONSE_GET | jq '.apps[0] .appId' | sed 's/\"//g')"
  echo $APP_ID
fi

CONFIG=$(curl \
  -X GET -H "Authorization: Bearer $BEARER_ACCESS_TOKEN" \
  https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps/${APP_ID}/config)

echo $CONFIG

PROJECT_NUMBER="$(echo $CONFIG | jq '.messagingSenderId' | sed 's/\"//g')"
echo $PROJECT_NUMBER

cd ${CURRENT_PATH}/barnard-language-learning-app

sed -i "" -e "s/\"_CONFIG_PLACEHOLDER_\"/$(echo $CONFIG | \
  sed -e 's/\\/\\\\/g; s/\//\\\//g; s/&/\\\&/g')/g" ./src/config.json

npm install
npm run build
firebase deploy


if ! [ -z "${TRANSLATION_SPREADSHEET_ID}" ]
  then
    python ./functions/trix2firestore.py \
    $TRANSLATION_SPREADSHEET_ID $PROJECT_ID $CLIENT_ID_FILE
fi

# Enable sign-in methods
read -p "Enable Google and email/password sign-in by visiting \
  https://firebase.corp.google.com/u/0/project/${PROJECT_ID}/authentication/providers. \
 Then come back here and press [Enter] to continue ..."

# Grant build service account owner access
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
 --member serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com \
 --role roles/editor

# Link project to mirror github
read -p "Visit https://console.cloud.google.com/cloud-build/triggers?project=${PROJECT_ID} \
  and connect repository choosing Github mirrored.  \
 Then come back here and press [Enter] to continue ..."

 RESPONSE="$(gcloud beta builds triggers list)"

 if [[ $RESPONSE == *"createTime"* ]]; then
   echo "Trigger already added. Skipping creation..."
 else
   gcloud beta builds triggers create cloud-source-repositories \
    --repo="github_googlecloudplatform_barnard-language-learning-app" \
    --branch-pattern="^master$" \
    --build-config="app/cloudbuild.yaml" \
    --substitutions _API_URL=https://us-central1-${PROJECT_ID}.cloudfunctions.net,_BUCKET_LOCATION=us,_BUCKET_NAME=${PROJECT_ID}-dev5,_GOOGLE_API_KEY=placeholder,_GOOGLE_REGION=en,_ENDANGERED_LANGUAGE=${LANGUAGE_NAME},_LANGUAGE=en,_TERRAFORM_BUCKET_NAME=${PROJECT_ID}-terraform-dev5,_THEME=red
 fi

 echo "UPDATE COMPLETE!"
