provider "google" {
  project = var.project_id
  region  = var.region
}

#------------------------------------------
# Resource | Cloud Tasks & Cloud Functions
#------------------------------------------
resource "google_cloud_tasks_queue" "task_post_dai0kou_v0_8" {
  name     = "task-post-dai0kou-blog-v-0-8"
  location = var.region

  app_engine_routing_override {
    service = "default"
  }
}

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

# IAM (Between cloud functions)
resource "google_cloudfunctions_function_iam_member" "invoke_permission" {
  project        = google_cloudfunctions_function.task_exec_post.project
  region         = google_cloudfunctions_function.task_exec_post.region
  cloud_function = google_cloudfunctions_function.task_exec_post.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}

# Functions | Generate Cloud Tasks
resource "google_storage_bucket_object" "function_zip_generate_task" {
  name   = "function-src-generate-task.zip"
  bucket = google_storage_bucket.source_bucket.name
  source = "${path.module}/functions/generate_task.zip"
}
resource "google_cloudfunctions2_function" "function_generate_task" {
  name        = "dai0kou-function-generate-task"
  description = "Creates Cloud Tasks when Firestore is triggered"
  location    = var.region
  build_config {
    runtime    = "python311"
    entry_point = "generate_task"
    source {
      storage_source {
        bucket = google_storage_bucket.source_bucket.name
        object = google_storage_bucket_object.function_zip_generate_task.name
      }
    }
  }
  service_config {
    min_instance_count = 0
    max_instance_count = 5
    available_memory   = "256M"
    environment_variables = {
      CLOUD_RUN_URL     = google_cloudfunctions_function.task_exec_post.https_trigger_url
      TASK_QUEUE_NAME   = google_cloud_tasks_queue.task_post_dai0kou_v0_8.name
      PROJECT_ID        = var.project_id
      REGION            = var.region
    }
  }

  event_trigger {
    trigger_region = var.region
    event_type = "google.cloud.firestore.document.v1.created"
    event_filters {
      attribute = "database"
      value = "(default)"
    }
    event_filters {
      attribute = "document"
      value = "setting_via_project/*"
      operator = "match-path-pattern"
    }

  }

  depends_on = [
    google_cloudfunctions_function.task_exec_post,
    google_cloud_tasks_queue.task_post_dai0kou_v0_8
  ]
}

# Functions | Post(including iam)
resource "google_storage_bucket_object" "function_zip_post" {
  name   = "function-src-post.zip"
  bucket = google_storage_bucket.source_bucket.name
  source = "${path.module}/functions/post.zip"
}
resource "google_cloudfunctions_function" "task_exec_post" {
  name        = "task-exec-post"
  description = "Processes tasks triggered by Cloud Tasks"
  runtime     = "python311"
  entry_point = "post_blog"
  source_archive_bucket = google_storage_bucket.source_bucket.name
  source_archive_object = google_storage_bucket_object.function_zip_post.name
  trigger_http          = true
  service_account_email = google_service_account.cloud_run_service_account.email
  available_memory_mb   = 512
  timeout               = 90
  environment_variables = {
    X_CONSUMER_KEY = var.x_consumer_key
    X_CONSUMER_SECRET = var.x_consumer_secret
    X_ACCESS_TOKEN = var.x_access_token
    X_ACCESS_TOKEN_SECRET = var.x_access_token_secret
    X_BEARER_TOKEN = var.x_bearer_token
  }
}

#------------------------------------------
# Resource | Cloud Run(API)
#------------------------------------------
resource "google_service_account" "cloud_run_service_account" {
  account_id   = "cloud-run-firestore-sa"
  display_name = "Cloud Run Firestore Service Account"
}

resource "google_project_iam_binding" "firestore_binding" {
  role    = "roles/datastore.user"
  members = ["serviceAccount:${google_service_account.cloud_run_service_account.email}"]
  project = var.project_id
}

resource "google_project_iam_binding" "vertex_ai_binding" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  members = ["serviceAccount:${google_service_account.cloud_run_service_account.email}"]
}

# Cloud Run サービス
resource "google_cloud_run_service" "generate_setting" {
  name     = "generate-setting"
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
      timeout_seconds = 300
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