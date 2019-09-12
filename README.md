# Google Barnard

## Requirements

* Node 10.16+
* Angular 8.3+
* Terraform

## Setup

### Google Cloud Project

* Create a new project in the Google Cloud Console.
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

* In `./terraform` create the file `main.auto.tfvars` with your terraform variable values.

## Development

* cd to `./app`.
* Run `ng serve`.
* Navigate to `http://localhost:4200/`.

## Deployment

### Terraform

* cd to `./terraform`.
* Run `terraform apply`.

### App

* cd to `./app`.
* Run `ng build -c production`.
* Run `gsutil -m rsync -rd ./dist/google-barnard <BUCKET_URL>`.
  * To get the BUCKET_URL, run `terraform output bucket_url`.
* Run `gsutil -m setmeta -h 'Content-Type:text/javascript' <BUCKET_URL>/**/*.js`.
