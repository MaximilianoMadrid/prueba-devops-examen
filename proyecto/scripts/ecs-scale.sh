#!/bin/bash
# Escala un servicio ECS Fargate a N tareas.
# Uso: ecs-scale.sh <service> <desired-count>
set -euo pipefail

SERVICE="$1"
DESIRED_COUNT="$2"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/.ecs-runtime.env"

aws ecs update-service \
  --cluster "$CLUSTER_NAME" \
  --service "$SERVICE" \
  --desired-count "$DESIRED_COUNT" \
  --region "$AWS_REGION" >/dev/null

echo "Escalando $SERVICE a $DESIRED_COUNT tarea(s)..."
aws ecs wait services-stable --cluster "$CLUSTER_NAME" --services "$SERVICE" --region "$AWS_REGION"
echo "Listo."
