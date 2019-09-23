#!/usr/bin/env bash

. ./gcp_vars.sh

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Run build
pushdir ${SCRIPT_DIR}/../
gcloud builds submit --substitutions=_GOOGLE_REGION=${GOOGLE_REGION},_GOOGLE_API_KEY=${GOOGLE_API_KEY},\
    _BUCKET_NAME=${BUCKET_NAME},_BUCKET_LOCATION=${BUCKET_LOCATION},_LANGUAGE=${LANGUAGE},\
    ,_THEME=${THEME},_TERRAFORM_BUCKET_NAME=${TERRAFORM_BUCKET_NAME}
popdir