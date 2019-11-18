# Deployment

## Cloud Build deployment

* tag commit with `prod-*` tag
* push commit and tags with `git push origin master --tags`

## Manual deployment

### Terraform

* cd to `./terraform`.
* Run `terraform apply`.

### App

* cd to `./client`.
* Run `ng build -c production --output-path=dist --i18n-file src/locale/messages.<UI_LANGUAGE>.xlf --i18n-locale <UI_LANGUAGE>`.
* Run `gsutil -m rsync -rd ./dist/google-barnard <BUCKET_URL>`.
  * To get the BUCKET_URL, run `terraform output bucket_url`.
* Run `gsutil -m setmeta -h 'Content-Type:text/javascript' <BUCKET_URL>/**/*.js`.
* Run `terraform output app_url` to get the URL of your app.

### Server

* cd to `./server`
* Run `npm run build`
* Run `gcloud app deploy`