#!/usr/bin/env bash

. ./gcp_vars.sh

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com

# Get build service account by role
BUILD_SERVICE_ACCOUNT=`gcloud projects get-iam-policy ${PROJECT_ID} --filter=bindings.role:roles/cloudbuild.builds.builder --format='table[no-heading](bindings.members)' --flatten='bindings[].members' --limit=1`

# Create custom role for build service
gcloud iam roles create barnard.appdeployer --project=${PROJECT_ID} --permissions=appengine.applications.create

# Add required roles to build service account
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member ${BUILD_SERVICE_ACCOUNT} --role roles/storage.admin
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member ${BUILD_SERVICE_ACCOUNT} --role roles/compute.admin
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member ${BUILD_SERVICE_ACCOUNT} --role projects/${PROJECT_ID}/roles/barnard.appdeployer

# Create a bucket for terraform state
gsutil mb -c nearline -l ${TERRAFORM_BUCKET_LOCATION} -b on gs://${TERRAFORM_BUCKET_NAME}
gsutil versioning set on gs://${TERRAFORM_BUCKET_NAME}