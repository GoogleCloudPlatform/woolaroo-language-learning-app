# Google Barnard

## Requirements

* Node 10.16+
* Angular 8.3+
* Terraform

## Setup

### Google Cloud Project

* Create a new project in the Google Cloud Console.
* Enable the `Compute Engine API` in the `APIs & Services` section.
* Create a service account with `Storage Admin` and `Compute Admin` roles.
* Generate and download a private key for the service account in JSON format.
* Rename the private key to `./terraform/account.json`.

### Terraform

* cd to `./terraform`.
* Run `terraform init`.

### App

* cd to `./app`.
* Run `npm install`.

## Configuration

### App

### Terraform

* To avoid having to input your terraform values every time it is run, create the file `./terraform/main.auto.tfvars` with your terraform variable values.

## Development

* cd to `./app`.
* Run `ng serve`.
* Navigate to `http://localhost:4200/`.

## Localization

* To create a version of the app in a specific language:
  * Generate the language template file by running `ng xi18n --output-path=src/locale` from the `./app` directory.
  * Copy the template file and rename it to `src/locale/messages.<LANGUAGE>.xlf`.
  * Add language translations (https://angular.io/guide/i18n#translate-the-source-text).
  * Rebuild the app with the `i18n-file` and `i18n-locale` arguments (see below).

## Deployment

### Terraform

* cd to `./terraform`.
* Run `terraform apply`.

### App

* cd to `./app`.
* Run `ng build -c production --output-path=dist --i18n-file src/locale/messages.<UI_LANGUAGE>.xlf --i18n-locale <UI_LANGUAGE>`.
* Run `gsutil -m rsync -rd ./dist/google-barnard <BUCKET_URL>`.
  * To get the BUCKET_URL, run `terraform output bucket_url`.
* Run `gsutil -m setmeta -h 'Content-Type:text/javascript' <BUCKET_URL>/**/*.js`.
* Run `terraform output app_url` to get the URL of your app.
