resource "aws_cloudfront_origin_access_identity" "s3_distribution" {
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.bucket.bucket_regional_domain_name
    origin_id   = "regional"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.s3_distribution.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = [ var.alias ]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "regional"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.cert_arn 
    ssl_support_method = "sni-only"
  }

  custom_error_response {
    error_code = 403
    response_code = 200
    error_caching_min_ttl = 0
    response_page_path = "/"
  }

  custom_error_response {
    error_code = 404
    response_code = 200
    error_caching_min_ttl = 0
    response_page_path = "/"
  }

  wait_for_deployment = false
}