# Horoscope Service

This project implements a daily horoscope service using AWS Lambda, DynamoDB, and Next.js. It fetches daily horoscope predictions from the VedicAstroAPI and displays them in a responsive web interface.

## Architecture

- **AWS Lambda Function**: Runs daily at midnight to fetch horoscope predictions for all zodiac signs
- **DynamoDB**: Stores the daily predictions with zodiac sign and date as the composite key
- **Next.js Frontend**: Displays the horoscope predictions in a responsive grid layout
- **API Route**: Fetches today's predictions from DynamoDB

## Prerequisites

1. AWS CLI installed and configured
2. Node.js 18 or later
3. VedicAstroAPI credentials
4. AWS account with appropriate permissions

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# VedicAstro API Configuration
VEDIC_ASTRO_API_URL=your_api_url
VEDIC_ASTRO_API_KEY=your_api_key

# DynamoDB Configuration
DYNAMODB_TABLE_NAME=horoscopes
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Deploy AWS infrastructure:
   ```bash
   # Make the deploy script executable
   chmod +x aws/deploy.sh
   
   # Deploy
   ./aws/deploy.sh
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/app` - Next.js application files
  - `/api` - API routes
  - `/horoscopes` - Horoscope page
- `/aws` - AWS infrastructure files
  - `cloudformation.yaml` - CloudFormation template
  - `deploy.sh` - Deployment script
  - `fetchHoroscopes.js` - Lambda function
- `/components` - React components
- `/types` - TypeScript type definitions

## Features

- Daily horoscope predictions for all 12 zodiac signs
- Responsive grid layout
- Server-side rendering with Next.js
- Automated daily updates via AWS Lambda
- Persistent storage in DynamoDB

## Development

1. Make changes to the frontend:
   ```bash
   npm run dev
   ```

2. Update AWS infrastructure:
   ```bash
   ./aws/deploy.sh
   ```

## Testing

1. Test the Lambda function locally:
   ```bash
   aws lambda invoke --function-name fetchHoroscopes --payload '{}' output.json
   ```

2. View DynamoDB data:
   ```bash
   aws dynamodb scan --table-name horoscopes
   ```

## Deployment

1. Deploy frontend changes:
   ```bash
   npm run build
   npm run start
   ```

2. Update AWS resources:
   ```bash
   ./aws/deploy.sh
   ```

## Monitoring

- Check CloudWatch Logs for Lambda function execution
- Monitor DynamoDB metrics in AWS Console
- View API route logs in Next.js logs

## Troubleshooting

1. Lambda function issues:
   - Check CloudWatch Logs
   - Verify environment variables
   - Test VedicAstroAPI access

2. DynamoDB issues:
   - Verify table exists
   - Check IAM permissions
   - Validate data format

3. Frontend issues:
   - Check browser console
   - Verify API responses
   - Test local development server

## License

MIT
