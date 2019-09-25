variable "google_project" {}
variable "google_credentials" {
    default = ""
}
variable "google_region" {}
variable "bucket_name" {}
variable "bucket_location" {
  default = ""
}

output "app_url" {
  value = "http://${google_compute_global_address.app-ip.address}/"
}

output "bucket_url" {
  value = "gs://${var.bucket_name}"
}

provider "google" {
  credentials = var.google_credentials
  project = var.google_project
  region = var.google_region
}

resource "google_storage_bucket" "app-store" {
  name = var.bucket_name
  location = var.bucket_location
  storage_class = "MULTI_REGIONAL"
  bucket_policy_only = true

  website {
    main_page_suffix = "index.html"
    not_found_page = "404.html"
  }
}

resource "google_storage_bucket_iam_member" "app-store-acl" {
  bucket = "${google_storage_bucket.app-store.name}"
  role = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_compute_backend_bucket" "app-backend" {
  name = "barnard-backend"
  bucket_name = "${google_storage_bucket.app-store.name}"
  enable_cdn = true
}

resource "google_compute_global_address" "app-ip" {
  name = "barnard-ip"
}

resource "google_compute_global_forwarding_rule" "app-forwarding-rule" {
  name = "barnard-forwarding-rule"
  port_range = "80"
  ip_address = "${google_compute_global_address.app-ip.address}"
  target = "${google_compute_target_http_proxy.app-http-proxy.self_link}"
}

resource "google_compute_target_http_proxy" "app-http-proxy" {
  name = "barnard-http-proxy"
  url_map = "${google_compute_url_map.app-url-map.self_link}"
}

resource "google_compute_url_map" "app-url-map" {
  name = "barnard-url-map"
  default_service = "${google_compute_backend_bucket.app-backend.self_link}"
}