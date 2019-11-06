terraform {
  backend "gcs" {
    bucket = "woolaroo-terraform-bucket-test-mic"
    prefix = "terraform/state"
  }
}
