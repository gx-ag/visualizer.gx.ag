set -e
export AWS_PAGER=""
PROFILE=jabu
TERRAFORM_OUTPUT=`cd infrastructure/prod && terraform output -json`
BUCKET_NAME=`echo "$TERRAFORM_OUTPUT" | jq -r ".bucket_name.value"`
DISTRIBUTION_ID=`echo "$TERRAFORM_OUTPUT" | jq -r ".distribution_id.value"`
aws s3 rm s3://$BUCKET_NAME --recursive --profile $PROFILE
aws s3 cp dist s3://$BUCKET_NAME/ --recursive --profile $PROFILE
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" --profile $PROFILE