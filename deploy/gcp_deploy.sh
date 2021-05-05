#!/usr/bin/env bash

# Location of the bucket - https://cloud.google.com/storage/docs/locations#available_locations (optional)
BUCKET_LOCATION=''
# App location - https://cloud.google.com/compute/docs/regions-zones/#locations
APP_LOCATION=''
# Cloud vision and translation API key
GOOGLE_API_KEY=''
# Google Analytics Tracker ID (optional)
GOOGLE_TRACKER_ID=''
# UI language code (must be 'en' for now)
LANGUAGE=en
# URL of backend API
API_URL=''
# URL of app (optional)
APP_URL=''
# Service name of app (optional)
APP_SERVICE=''
# Google project ID - default to current project ID
PROJECT_ID=`gcloud config get-value project`
# Name of the bucket - can be any unique non-whitespace string
BUCKET_NAME=${PROJECT_ID}-app
# Name of the bucket containing terraform state
TERRAFORM_BUCKET_NAME=${PROJECT_ID}-terraform
# Path of the terraform state within the bucket
TERRAFORM_BUCKET_PATH=state
# Color theme for the app - "red", "orange", "dark-orange", "turquoise" or "green"
THEME='red'
# Name of the endangered language (e.g. Sicilian)
ENDANGERED_LANGUAGE=''
# URL of the partner logo (gs://<url>)
PARTNER_LOGO_URL=''
# Name of the endangered language (e.g. Sicilian)
ENDANGERED_LANGUAGE=''
# Terms and conditions language (HTML)
TERMS_AND_CONDITIONS=''

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Run build
pushdir ${SCRIPT_DIR}/../
gcloud builds submit --substitutions=_APP_LOCATION=${APP_LOCATION},_GOOGLE_API_KEY=${GOOGLE_API_KEY},\
    _BUCKET_NAME=${BUCKET_NAME},_BUCKET_LOCATION=${BUCKET_LOCATION},_LANGUAGE=${LANGUAGE},\
    _THEME=${THEME},_TERRAFORM_BUCKET_NAME=${TERRAFORM_BUCKET_NAME},_TERRAFORM_BUCKET_PATH=${TERRAFORM_BUCKET_PATH},\
    _APP_URL=${APP_URL},_APP_SERVICE=${APP_SERVICE},_API_URL=${API_URL},_ENDANGERED_LANGUAGE=${ENDANGERED_LANGUAGE},\
    _PARTNER_LOGO_URL=${PARTNER_LOGO_URL},_TERMS_AND_CONDITIONS=${TERMS_AND_CONDITIONS}
popdir
