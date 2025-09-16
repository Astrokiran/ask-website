#!/usr/bin/env python3
"""
AWS Amplify Deployment Monitor

Monitors an Amplify deployment job and provides real-time status updates.
Usage: python monitor_amplify_deployment.py [job-id]
"""

import boto3
import time
import sys
from datetime import datetime
from botocore.exceptions import ClientError

# Configuration
APP_ID = "dqg032kft6snh"
BRANCH_NAME = "main"
REGION = "ap-south-1"
POLL_INTERVAL = 10  # seconds

def get_amplify_client():
    """Initialize and return AWS Amplify client"""
    return boto3.client('amplify', region_name=REGION)

def format_time(timestamp):
    """Format timestamp for display"""
    if timestamp:
        return timestamp.strftime("%Y-%m-%d %H:%M:%S")
    return "N/A"

def get_duration(start_time, end_time=None):
    """Calculate duration between timestamps"""
    if not start_time:
        return "N/A"

    end = end_time or datetime.now(start_time.tzinfo)
    duration = end - start_time

    total_seconds = int(duration.total_seconds())
    minutes = total_seconds // 60
    seconds = total_seconds % 60

    if minutes > 0:
        return f"{minutes}m {seconds}s"
    else:
        return f"{seconds}s"

def print_job_status(job):
    """Print formatted job status"""
    summary = job['summary']
    steps = job.get('steps', [])

    print(f"\n{'='*60}")
    print(f"📱 Amplify Deployment Monitor - {datetime.now().strftime('%H:%M:%S')}")
    print(f"{'='*60}")

    # Job summary
    print(f"🔧 Job ID: {summary['jobId']}")
    print(f"📊 Status: {summary['status']}")
    print(f"🔗 Commit: {summary.get('commitId', 'N/A')[:8]}...")
    print(f"⏰ Started: {format_time(summary.get('startTime'))}")

    if summary['status'] in ['SUCCEED', 'FAILED']:
        print(f"🏁 Finished: {format_time(summary.get('endTime'))}")
        print(f"⏱️  Total Duration: {get_duration(summary.get('startTime'), summary.get('endTime'))}")
    else:
        print(f"⏱️  Running for: {get_duration(summary.get('startTime'))}")

    # Steps details
    if steps:
        print(f"\n📋 Steps Progress:")
        for i, step in enumerate(steps, 1):
            status_emoji = {
                'PENDING': '⏳',
                'RUNNING': '🔄',
                'SUCCEED': '✅',
                'FAILED': '❌',
                'CANCELLED': '🚫'
            }.get(step['status'], '❓')

            step_name = step['stepName']
            step_status = step['status']
            step_duration = get_duration(step.get('startTime'), step.get('endTime'))

            print(f"  {i}. {status_emoji} {step_name}: {step_status} ({step_duration})")

    # Status-specific messages
    if summary['status'] == 'SUCCEED':
        print(f"\n🎉 Deployment completed successfully!")
        print(f"🌐 Your site should be live at: https://astrokiran.com")
    elif summary['status'] == 'FAILED':
        print(f"\n💥 Deployment failed!")
        if steps:
            failed_steps = [s for s in steps if s['status'] == 'FAILED']
            if failed_steps:
                print(f"❌ Failed step(s): {', '.join([s['stepName'] for s in failed_steps])}")
    elif summary['status'] in ['PENDING', 'RUNNING']:
        print(f"\n🔄 Deployment in progress... (checking again in {POLL_INTERVAL}s)")

def monitor_job(job_id=None):
    """Monitor the Amplify job"""
    client = get_amplify_client()

    try:
        # If no job ID provided, get the latest job
        if not job_id:
            print("🔍 Getting latest deployment job...")
            branches = client.list_branches(appId=APP_ID)
            for branch in branches['branches']:
                if branch['branchName'] == BRANCH_NAME:
                    job_id = branch.get('activeJobId')
                    break

            if not job_id:
                print("❌ No active job found for the main branch")
                return

        print(f"👀 Monitoring job: {job_id}")
        print("Press Ctrl+C to stop monitoring\n")

        while True:
            try:
                # Get job details
                response = client.get_job(
                    appId=APP_ID,
                    branchName=BRANCH_NAME,
                    jobId=job_id
                )

                job = response['job']
                print_job_status(job)

                # Check if job is finished
                status = job['summary']['status']
                if status in ['SUCCEED', 'FAILED', 'CANCELLED']:
                    break

                # Wait before next check
                time.sleep(POLL_INTERVAL)

            except ClientError as e:
                error_code = e.response['Error']['Code']
                if error_code == 'NotFoundException':
                    print(f"❌ Job {job_id} not found")
                    break
                else:
                    print(f"❌ AWS Error: {e}")
                    time.sleep(POLL_INTERVAL)
                    continue

    except KeyboardInterrupt:
        print(f"\n\n⏹️  Monitoring stopped by user")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Main function"""
    job_id = None

    # Check for job ID argument
    if len(sys.argv) > 1:
        job_id = sys.argv[1]
        if not job_id.isdigit():
            print("❌ Job ID must be numeric")
            sys.exit(1)
        job_id = job_id.zfill(10)  # Pad with zeros to 10 digits

    monitor_job(job_id)

if __name__ == "__main__":
    main()