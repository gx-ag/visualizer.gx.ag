data "aws_route53_zone" "main" {
  name = "${local.domain}."
}

data "aws_acm_certificate" "cert" {
  domain   = local.domain
  statuses = ["ISSUED"]
}

module "visualizer" {
  source   = "../modules/visualizer"
  prefix   = local.prefix
  cert_arn = data.aws_acm_certificate.cert.arn
  domain   = "${local.alias}"
  alias    = "${local.alias}"
  zone_id  = data.aws_route53_zone.main.zone_id
}