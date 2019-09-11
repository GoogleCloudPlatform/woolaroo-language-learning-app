variable "google_project" {}
variable "bucket_name" {}
variable "bucket_location" {
	default = ""
}

output "bucket_url" {
	value = "https://storage.googleapis.com/${var.bucket_name}/index.html"
}

provider "google" {
  credentials = "${file("account.json")}"
  project     = var.google_project
}

resource "google_storage_bucket" "app-store" {
  name     = var.bucket_name
  location = var.bucket_location
  storage_class = "MULTI_REGIONAL"
  bucket_policy_only = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}

resource "google_storage_bucket_iam_member" "app-store-acl" {
  bucket = "${google_storage_bucket.app-store.name}"
  role = "roles/storage.objectViewer"
  member = "allUsers"
}