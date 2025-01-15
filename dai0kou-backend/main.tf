provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_storage_bucket" "source_bucket" {
  name          = "${var.project_id}-cloud-functions-source"
  location      = var.region
  force_destroy = true
}

resource "google_storage_bucket_object" "function_zip" {
  name   = "function-source.zip"
  bucket = google_storage_bucket.source_bucket.name
  source = "${path.module}/functions.zip"
}

resource "google_cloudfunctions_function" "python_function" {
  name        = "dai0kou-blog-function"
  description = "A simple Python Cloud Function"
  runtime     = "python311"
  entry_point = "post_blog"
  region      = var.region

  source_archive_bucket = google_storage_bucket.source_bucket.name
  source_archive_object = google_storage_bucket_object.function_zip.name

  trigger_http = true

  available_memory_mb = 512
  timeout = 90

  depends_on = [
    google_storage_bucket_object.function_zip
  ]

  environment_variables = {
    ENV_VAR = "example_value"
  }
}

output "function_url" {
  value = google_cloudfunctions_function.python_function.https_trigger_url
}