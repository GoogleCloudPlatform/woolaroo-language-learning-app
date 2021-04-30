#!/usr/bin/env bash

# Google project ID - default to current project ID
PROJECT_ID=`gcloud config get-value project`

# Enable required APIs
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firebase.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable cloudkms.googleapis.com
gcloud services enable vision.googleapis.com
gcloud services enable sheets.googleapis.com
gcloud services enable drive.googleapis.com

# Get build service account by role
BUILD_SERVICE_ACCOUNT=`gcloud projects get-iam-policy ${PROJECT_ID} --filter=bindings.role:roles/cloudbuild.builds.builder --format='table[no-heading](bindings.members)' --flatten='bindings[].members' --limit=1`

# Add required roles to build service account
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member ${BUILD_SERVICE_ACCOUNT} --role roles/cloudfunctions.admin
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member ${BUILD_SERVICE_ACCOUNT} --role roles/cloudkms.cryptoKeyDecrypter
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member ${BUILD_SERVICE_ACCOUNT} --role roles/firebase.admin
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member ${BUILD_SERVICE_ACCOUNT} --role roles/iam.serviceAccountUser
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member ${BUILD_SERVICE_ACCOUNT} --role roles/serviceusage.apiKeysAdmin
