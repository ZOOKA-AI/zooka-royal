
#!/bin/bash
# deploy.sh
# Triggers the deployment process using Google Cloud Build.

set -e # Exit script on any error

echo "🚀 Starting sovereign deployment protocol..."

# Ensure gcloud is authenticated and project is set
if ! gcloud auth list | grep -q '^\*'; then
    echo "❌ Not authenticated with gcloud. Please run 'gcloud auth login'."
    exit 1
fi

PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ GCP project not set. Please run 'gcloud config set project YOUR_PROJECT_ID'."
    exit 1
fi

echo "✅ Authenticated. Project: ${PROJECT_ID}"
echo "Submitting build to Google Cloud Build..."

# Submit the current directory for a build using the cloudbuild.yaml config
gcloud builds submit --config cloudbuild.yaml .

echo "✨ Deployment signal sent to the cloud. Monitor progress in your GCP console."
