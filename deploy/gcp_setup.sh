#!/usr/bin/env bash

# Location of the bucket - https://cloud.google.com/storage/docs/locations#available_locations
TERRAFORM_BUCKET_LOCATION='asia'
# Google project ID - default to current project ID
PROJECT_ID=`gcloud config get-value project`
# Name of the bucket containing terraform state
TERRAFORM_BUCKET_NAME=${PROJECT_ID}-terraform

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable appengine.googleapis.com

# Get build service account by role
BUILD_SERVICE_ACCOUNT=`gcloud projects get-iam-policy ${PROJECT_ID} --filter=bindings.role:roles/cloudbuild.builds.builder --format='table[no-heading](bindings.members)' --flatten='bindings[].members' --limit=1`

# Create custom role for build service
gcloud iam roles create woolaroo.appdeployer --project=${PROJECT_ID} --permissions=appengine.applications.create

# Add required roles to build service account
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member ${BUILD_SERVICE_ACCOUNT} --role roles/storage.admin
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member ${BUILD_SERVICE_ACCOUNT} --role roles/appengine.appAdmin
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member ${BUILD_SERVICE_ACCOUNT} --role projects/${PROJECT_ID}/roles/woolaroo.appdeployer

# Create a bucket for terraform state
gsutil mb -c nearline -l ${TERRAFORM_BUCKET_LOCATION} -b on gs://${TERRAFORM_BUCKET_NAME}
gsutil versioning set on gs://${TERRAFORM_BUCKET_NAME}
