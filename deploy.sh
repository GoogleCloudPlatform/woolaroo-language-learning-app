# Purpose of this deploy.sh is to make it runnable as a startup script in VM

PROJECT_ID='barnard-tamazight'
SERVICE_ACCOUNT='907531042102-compute@developer.gserviceaccount.com'
TRANLSATION_SHEET_ID='14txRy8VezCS4JTYMwALirMCF69PjVIuXWr9kIuoiDVA'
HOSTNAME="$(hostname)"
export PROJECT_ID="${PROJECT_ID}"
gcloud compute instances describe ${HOSTNAME} --format json


# install firebase cli & git
curl -sL firebase.tools | bash
sudo apt install git-all
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py


gcloud config set account your-email@gmail.com
gcloud auth login
gcloud auth application-default login
gcloud config set project "${PROJECT_ID}"


# Enable APIs
gcloud services enable firebase.googleapis.com
gcloud services enable credentials.googleapis.com
gcloud services enable sheets.googleapis.com
gcloud services enable firestore.googleapis.com

# Install Git  & download github code & change to current project
git clone -b yiling/deploy https://github.com/GoogleCloudPlatform/barnard-language-learning-app.git
# TODO(yilliu): Maintain a deployable version
cd ./barnard-language-learning-app
sed -i "s/barnard-project/${PROJECT_ID}/g" .firebaserc

# Add firebase to current GCP project
# https://firebase.google.com/docs/projects/api/reference/rest/v1beta1/projects/addFirebase
# TODO(yilliu): Make this programmable

# Grant roles, create service account key, set as application default credential
gcloud compute instances describe ${hostname}
gcloud auth application-default

gcloud beta iam service-accounts create "${SERVICE_ACCOUNT}" \
    --description "Service account for barnard-language-learning-app" \
    --display-name "barnard-language-learning-app-service-account"
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member serviceAccount:"${SERVICE_ACCOUNT}" \
  --role roles/owner
gcloud iam service-accounts keys create key.json --iam-account="${SERVICE_ACCOUNT}"
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/key.json"


# Initiate cloud functions
firebase init functions
cd  ./functions
firebase deploy --only functions

# Change firebase default location
# https://firebase.google.com/docs/projects/api/reference/rest/v1beta1/projects.defaultLocation/finalize
# TODO(yilliu): Make this programmable
# This one doesn't work: gcloud compute project-info add-metadata \
#     --metadata google-compute-default-region=us-central1,google-compute-default-zone=us-central1-b
# gcloud init

# Initiate firestore & storage
cd ..
firebase init firestore
firebase init storage
cd ./functions

# Create firestore
# Go to firebase UI to create firestore/upgrade from Cloud console
# TOTO(yilliu): Make this programmable

# Push data into firestore, using service account credentials
sudo python3 get-pip.py 
pip3 install google-api-python-client --user
pip3 install  google-auth-oauthlib --user
pip3 install firebase-admin --user
python3 trix2firestore.py "${TRANLSATION_SHEET_ID}"

# Change AuthUtils.js manually
# Change ApiUtils.js manually





