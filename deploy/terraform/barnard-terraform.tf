variable "project_name" {}
variable "billing_account" {}
variable "org_id" {}
variable "region" {}
variable "folder_id" {}

provider "google" {
  region = "${var.region}"
}

resource "random_id" "id" {
  byte_length = 4
  prefix      = "${var.project_name}-"
}

resource "google_project" "project" {
  name            = "${var.project_name}"
  project_id      = "${random_id.id.hex}"
  billing_account = "${var.billing_account}"
  #org_id          = "${var.org_id}"
  folder_id = "${var.folder_id}"
}

resource "google_project_service" "sheets" {
  project                    = "${google_project.project.project_id}"
  service                    = "sheets.googleapis.com"
  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "vision" {
  project                    = "${google_project.project.project_id}"
  service                    = "vision.googleapis.com"
  disable_dependent_services = false
  disable_on_destroy         = false
}

# No endpoints for firestore.google.com, firestore.google.com and
# credentials.google.com. They need to be enabled via gcloud or manually.

output "project_id" {
  value = "${google_project.project.project_id}"
}
