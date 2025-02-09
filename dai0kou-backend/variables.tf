variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "asia-northeast1"
}

variable "container_image" {
  description = "The Docker container image URL for the Cloud Run service"
}

variable "x_consumer_key" {
  type        = string
  default     = "xx"
}
variable "x_consumer_secret" {
  type        = string
  default     = "xx"
}
variable "x_access_token" {
  type        = string
  default     = "xx"
}
variable "x_access_token_secret" {
  type        = string
  default     = "xx"
}
variable "x_bearer_token" {
  type        = string
  default     = "xx"
}