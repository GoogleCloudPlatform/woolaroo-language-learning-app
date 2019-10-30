# Purpose of this deploy.sh is to make it runnable as a startup script in VM

# Add firebase to current GCP project
# https://firebase.google.com/docs/projects/api/reference/rest/v1beta1/projects/addFirebase

# Change firebase default location
# https://firebase.google.com/docs/projects/api/reference/rest/v1beta1/projects.defaultLocation/finalize

# Create a cloud instance which will be auto garbage collected.


PROJECT_ID='barnard-yangzhuang'
SERVICE_ACCOUNT='147290144545-compute@developer.gserviceaccount.com'
TRANLSATION_SHEET_ID='14txRy8VezCS4JTYMwALirMCF69PjVIuXWr9kIuoiDVA'
HOSTNAME="$(hostname)"
export PROJECT_ID="${PROJECT_ID}"
# gcloud compute instances describe ${HOSTNAME} --format json





# install firebase cli & git
curl -sL firebase.tools | bash
sudo apt install git-all
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
sudo python3 get-pip.py


# TODO(yilliu): Here needs to prompt out
gcloud config set account yilliu@google.com
# gcloud auth login
gcloud auth application-default login
gcloud config set project "${PROJECT_ID}"


# Enable APIs
gcloud services enable firebase.googleapis.com
gcloud services enable credentials.googleapis.com
gcloud services enable sheets.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable vision.googleapis.com

# Install Git  & download github code & change to current project
git clone -b yiling/deploy https://github.com/GoogleCloudPlatform/barnard-language-learning-app.git
# TODO(yilliu): Maintain a deployable version
cd ./barnard-language-learning-app
sed -i "s/barnard-project/${PROJECT_ID}/g" .firebaserc
sed -i "s/barnard-project/${PROJECT_ID}/g" ./src/utils/ApiUtils.js
# Initiate firestore & storage
firebase init firestore
firebase init storage




# Grant roles, create service account key, set as application default credential
gcloud compute instances describe ${hostname}
gcloud auth application-default


gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member serviceAccount:"${SERVICE_ACCOUNT}" \
  --role roles/owner
gcloud iam service-accounts keys create key.json --iam-account="${SERVICE_ACCOUNT}"
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/key.json"


# Initiate cloud functions
firebase init functions # default prompt
cd  ./functions
firebase deploy --only functions





# Create firestore
# Go to firebase UI to create firestore/upgrade from Cloud console
# TOTO(yilliu): Make this programmable

# Push data into firestore, using service account credentials
pip3 install google-api-python-client --user
pip3 install  google-auth-oauthlib --user
pip3 install firebase-admin --user
pip3 install --upgrade firebase-admin --user
python3 trix2firestore.py "${TRANLSATION_SHEET_ID}"

# Change AuthUtils.js manually
# Set up OAuth Sign in Screen
# Enable Auth methods of Google and Email
# TODO(yilliu): Automate these 3 steps.

# Deploy
npm install
npm run build
firebase deploy






