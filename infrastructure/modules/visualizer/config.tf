variable "prefix" {}
variable "cert_arn" {}
variable "domain" {}
variable "zone_id" {}
variable "alias" {}

output "distribution_id" { value = aws_cloudfront_distribution.s3_distribution.id }