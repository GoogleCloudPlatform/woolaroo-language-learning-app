![alt text](logo.png)

## Project Woolaroo - Exploring Indigenous language through photos

> ###  “A picture is worth a thousand words.”

> ### - Old english adage, commonly attributed to copywriter Fred R. Barnard

Of the 7,000 languages spoken around the globe, 2,680 Indigenous languages - more than one third - are in danger of disappearing.

To help raise awareness and encourage people to explore indigenous languages, we developed Project Barnard - an open source photo-translation platform that’s powered by machine learning and image recognition.

Originally launched in New Zealand, as ‘Kupu’, in collaboration with Spark and the te aka Maori dictionary, this technology is now openly available for linguists and indigenous language organisations to create their own translation apps.

Our hope is that by enabling more people to share their language, users will be able to explore the indigenous languages around them, and ultimately be inspired to engage with them on a deeper level.

## Requirements

* Node 14+
* Angular 14.0+
* Terraform

## Setup

### Google Cloud Project

* Create a new project in the Google Cloud Console.
* Enable the `Compute Engine API` and `Cloud Build API` in the `APIs & Services` section.
* Create a service account with `Storage Admin` and `Compute Admin` roles.
* Generate and download a private key for the service account in JSON format.
* Rename the private key to `./terraform/account.json`.

### Terraform

* cd to `./terraform`.
* Run `terraform init`.

### App

* cd to `./client`.
* Run `npm install`.

## Configuration

### App

### Terraform

* To avoid having to input your terraform values every time it is run, create the file `./terraform/main.auto.tfvars` with your terraform variable values.

## Development

* cd to `./client`.
* Run `npm run start`.
* Navigate to `http://localhost:4200/woolaroo`.

As you can see, the app is set to run at a "woolaroo" path. This is purely for
consistency with how we at Google serve this on the Google Arts and Culture
experiments page. It ensures that all environments are consistent. However, there
is no specific need to do this. If you want to run it at the top level, then
be sure to us `ng serve` and change the asset BaseURL paramenters in the
environment config.

## Localization

* Supported UI languages are set in `src/environments/environment.ts`
* Language translations are in JSON format in `src/assets/locale`

## Deployment

See LIVEOPS.md
