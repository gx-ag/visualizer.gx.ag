terraform {
  backend "s3" {
    bucket  = "jaburu-state-prod"
    key     = "terraform/visualizer-gx-ag.tfstate"
    profile = "jabu"
    region  = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
  profile = "jabu"
}

locals {
  prefix = "visualizer-gx-ag"
  domain = "gx.ag"
  alias  = "visualizer.gx.ag"
}

output "distribution_id" { value = module.visualizer.distribution_id }
output "bucket_name" { value = local.alias }