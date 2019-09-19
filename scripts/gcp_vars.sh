#!/usr/bin/env bash

# Name of the bucket - can be any unique non-whitespace string
BUCKET_NAME=''
# Location of the bucket - https://cloud.google.com/storage/docs/locations#available_locations
BUCKET_LOCATION=''
# Project region - https://cloud.google.com/compute/docs/regions-zones/#locations
GOOGLE_REGION=''
# Cloud vision and translation API key
GOOGLE_API_KEY=''
# UI language code (must be 'en' for now)
LANGUAGE=en
# Name of the bucket containing terraform state
TERRAFORM_BUCKET_NAME=${BUCKET_NAME}-terraform
# Location of the bucket - https://cloud.google.com/storage/docs/locations#available_locations
TERRAFORM_BUCKET_LOCATION=''
# Google project ID - default to current project ID
PROJECT_ID=`gcloud config get-value project`