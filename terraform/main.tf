variable "google_project" {}
variable "google_region" {}
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

resource "google_compute_backend_bucket" "app-backend" {
  name        = "${var.bucket_name}-backend"
  bucket_name = "${google_storage_bucket.app-store.name}"
  enable_cdn  = true
}

resource "google_compute_global_address" "app-ip" {
  name = "${var.bucket_name}-ip"
}

resource "google_compute_forwarding_rule" "app-forwarding-rule" {
  name                  = "${var.bucket_name}-forwarding-rule"
  load_balancing_scheme = "EXTERNAL"
  backend_service       = "${google_compute_backend_bucket.app-backend.self_link}"
  port_range            = "80"
  ip_address            = "${google_compute_global_address.app-ip.address}"
}

resource "google_compute_route" "app-route" {
  name         = "${var.bucket_name}-route"
  dest_range   = "0.0.0.0/0"
  next_hop_ilb = "${google_compute_forwarding_rule.app-forwarding-rule.self_link}"
  priority     = 2000
}