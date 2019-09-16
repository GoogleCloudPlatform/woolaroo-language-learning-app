#!/bin/bash

LANGUAGE=$1
BUCKET_URL=$2
GOOGLE_API_KEY=$3

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd ${DIR}/terraform
terraform apply -auto-approve
BUCKET_URL=`terraform output bucket_url`

APP_DIR=${DIR}/../app
cd ${APP_DIR}

CONFIG_FILE="$APP_DIR/src/environments/environment.prod.ts"
CONFIG_TEMPLATE_FILE="$APP_DIR/src/environments/environment.prod.template.ts"
if [ -f "$CONFIG_TEMPLATE_FILE" ]; then
    cp ${CONFIG_TEMPLATE_FILE} ${CONFIG_FILE}
else
    cp ${CONFIG_FILE} ${CONFIG_TEMPLATE_FILE}
fi
sed -i "s/<GOOGLE_API_KEY>/${GOOGLE_API_KEY}/g" ${CONFIG_FILE}

ng build -c production --output-path="$APP_DIR/dist" --i18n-file "$APP_DIR/src/locale/messages.$LANGUAGE.xlf" --i18n-locale ${LANGUAGE}
gsutil -m rsync -rd "$DIR/dist" ${BUCKET_URL}
gsutil -m setmeta -h 'Content-Type:text/javascript' "$BUCKET_URL/**/*.js"
