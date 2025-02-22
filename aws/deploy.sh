#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment of Horoscope System..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if required environment variables are set
if [ -z "$VEDIC_ASTRO_API_KEY" ] || [ -z "$VEDIC_ASTRO_API_URL" ]; then
    echo "❌ Please set VEDIC_ASTRO_API_KEY and VEDIC_ASTRO_API_URL environment variables"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb axios

# Create deployment package for Lambda
echo "📦 Creating Lambda deployment package..."
cd aws
zip -r function.zip fetchHoroscopes.js
cd ..

# Create S3 bucket for Lambda code if it doesn't exist
BUCKET_NAME="horoscope-system-deployments"
aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null || {
    echo "🪣 Creating S3 bucket for Lambda code..."
    aws s3 mb "s3://$BUCKET_NAME"
}

# Upload Lambda code to S3
echo "⬆️ Uploading Lambda code to S3..."
aws s3 cp aws/function.zip "s3://$BUCKET_NAME/function.zip"

# Deploy CloudFormation stack
echo "🏗️ Deploying CloudFormation stack..."
aws cloudformation deploy \
    --template-file aws/cloudformation.yaml \
    --stack-name horoscope-system \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        VedicAstroApiKey="$VEDIC_ASTRO_API_KEY" \
        VedicAstroApiUrl="$VEDIC_ASTRO_API_URL"

# Clean up deployment package
echo "🧹 Cleaning up..."
rm aws/function.zip

# Get stack outputs
echo "📝 Getting stack outputs..."
STACK_OUTPUTS=$(aws cloudformation describe-stacks --stack-name horoscope-system --query 'Stacks[0].Outputs')
DYNAMODB_TABLE=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="HoroscopesTableName") | .OutputValue')
LAMBDA_ARN=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="FetchHoroscopesFunctionArn") | .OutputValue')

# Update .env file with stack outputs
echo "📝 Updating .env file..."
sed -i '' "s/DYNAMODB_TABLE=.*/DYNAMODB_TABLE=$DYNAMODB_TABLE/" .env

echo "✅ Deployment complete!"
echo "DynamoDB Table: $DYNAMODB_TABLE"
echo "Lambda Function ARN: $LAMBDA_ARN"
echo ""
echo "To start the Next.js development server, run:"
echo "npm run dev"
echo ""
echo "The horoscopes page will be available at: http://localhost:3000/horoscopes"
