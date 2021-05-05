# Deployment

## Cloud Build Trigger Configuration

For posterity, an example configuration of a source control based trigger is provided

* Ensure the Service account, Compute engine account etc are all enabled in the Cloud Build settings
* First setup a source - typically a mirrored github repo or similar
* Configure the Trigger Type and Regex rule, typically "Branch" trigger type with a "^master$" branch filter
* Specify the Cloud Build yaml file, in the OSS repo this is located at `/app/cloudbuild.yaml`
* Configure the required Substitution variables
	* `_API_URL` e.g. 'https://us-central1-barnard-myinstance.cloudfunctions.net'
	* `_BUCKET_LOCATION` e.g. 'us' see [here for more](https://cloud.google.com/compute/docs/regions-zones), make sure the regions and locations are compatible  
	* `_BUCKET_NAME` e.g. barnard-myinstance
	* `_ENDANGERED_LANGUAGE` e.g. 'Sicilian'
	* `_GOOGLE_REGION` e.g. 'us' 
	* `_LANGUAGE` e.g. 'en'
	* `_TERRAFORM_BUCKET_NAME` e.g. 'barnard-myinstance-terraform'
	* `_THEME` e.g. 'red'

## Cloud Build deployment

* tag commit with `prod-*` tag
* push commit and tags with `git push origin master --tags`

## Manual deployment

### Terraform

* cd to `./terraform`.
* Run `terraform apply`.

### App

* cd to `./client`.
* Run `ng build -c production --output-path=dist`.
* Run `gsutil -m rsync -rd ./dist/google-barnard <BUCKET_URL>`.
  * To get the BUCKET_URL, run `terraform output bucket_url`.
* Run `gsutil -m setmeta -h 'Content-Type:text/javascript' <BUCKET_URL>/**/*.js`.
* Run `terraform output app_url` to get the URL of your app.

### Server

* cd to `./server`
* Run `npm run build`
* Run `gcloud app deploy`