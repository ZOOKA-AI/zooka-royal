
#!/bin/bash
# update-service.sh
# Updates Cloud Run service configurations without deploying a new image.

set -e

SERVICE_NAME="zooka-frontend"
REGION="us-central1"

echo "Updating service configuration for '${SERVICE_NAME}'..."

# This script is a template. Uncomment and modify the commands you need.

# Example: Update an environment variable
# gcloud run services update ${SERVICE_NAME} \
#   --region ${REGION} \
#   --update-env-vars=KEY=VALUE

# Example: Update memory
# gcloud run services update ${SERVICE_NAME} \
#   --region ${REGION} \
#   --memory=512Mi

# Example: Update environment variables from a file
# Make sure you have a .env.yaml.production file ready.
# gcloud run services update ${SERVICE_NAME} \
#   --region ${REGION} \
#   --update-env-vars-from-file .env.yaml.production

echo "No updates specified in script. Edit this file to add your desired update commands."
