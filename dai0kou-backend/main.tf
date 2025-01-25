provider "google" {
  project = var.project_id
  region  = var.region
}

#--------------------------
# Resource
#--------------------------
resource "google_storage_bucket" "source_bucket" {
  name          = "${var.project_id}-cloud-functions-source"
  location      = var.region
  force_destroy = true
}

resource "google_storage_bucket" "ai_training_data_bucket" {
  name          = "${var.project_id}-ai-training-data"
  location      = var.region
  force_destroy = true
}

resource "google_storage_bucket_object" "function_zip" {
  name   = "function-source.zip"
  bucket = google_storage_bucket.source_bucket.name
  source = "${path.module}/functions.zip"
}

# resource "google_cloudfunctions_function" "cloudrun_generate_content" {
#   name        = "dai0kou-blog-function"
#   description = "A simple Python Cloud Function"
#   runtime     = "python311"
#   entry_point = "post_blog"
#   region      = var.region

#   source_archive_bucket = google_storage_bucket.source_bucket.name
#   source_archive_object = google_storage_bucket_object.function_zip.name

#   trigger_http = true

#   available_memory_mb = 512
#   timeout = 90

#   depends_on = [
#     google_storage_bucket_object.function_zip
#   ]

#   environment_variables = {
#     ENV_VAR = "example_value"
#   }
# }

resource "google_service_account" "cloud_run_service_account" {
  account_id   = "cloud-run-firestore-sa"
  display_name = "Cloud Run Firestore Service Account"
}

resource "google_project_iam_binding" "firestore_binding" {
  role    = "roles/datastore.user"
  members = [
    "serviceAccount:${google_service_account.cloud_run_service_account.email}"
  ]
  project = var.project_id
}

# Cloud Run サービス
resource "google_cloud_run_service" "generate_setting" {
  name     = "firestore-service"
  location = var.region

  template {
    spec {
      containers {
        image = var.container_image
        env {
          name  = "GOOGLE_CLOUD_PROJECT"
          value = var.project_id
        }
        ports {
          container_port = 8080
        }
      }
      timeout_seconds = 240
      service_account_name = google_service_account.cloud_run_service_account.email
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Cloud Run に全ユーザーアクセス権限を付与
resource "google_cloud_run_service_iam_member" "all_users_access" {
  service = google_cloud_run_service.generate_setting.name
  location = var.region
  role    = "roles/run.invoker"
  member  = "allUsers"
}

# ランダムサフィックス（バケット名の一意性確保）
resource "random_id" "suffix" {
  byte_length = 4
}

#--------------------------
# Output
#--------------------------
# output "function_url" {
#   value = google_cloudfunctions_function.cloudrun_generate_content.https_trigger_url
# }