#!/bin/bash
# Registra la task definition de un servicio y crea/actualiza el servicio
# ECS Fargate correspondiente, habilitando Service Connect para que los
# demás servicios puedan resolverlo por DNS interno (<discovery-name>.smartlogix.local).
#
# Uso:
#   ecs-deploy-service.sh <service> <container-name> <container-port> <public:true|false>
#
# Ejemplos:
#   ecs-deploy-service.sh db-auth       db-auth      5432 false
#   ecs-deploy-service.sh ms-auth       ms-auth      8081 false
#   ecs-deploy-service.sh api-gateway   api-gateway  8080 true
#   ecs-deploy-service.sh frontend      frontend     3000 true
set -euo pipefail

SERVICE="$1"
CONTAINER_NAME="$2"
CONTAINER_PORT="$3"
PUBLIC="${4:-false}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/.ecs-runtime.env"

export AWS_REGION AWS_ACCOUNT_ID ECR_REGISTRY EXECUTION_ROLE_ARN
export IMAGE_TAG="${IMAGE_TAG:-latest}"
export JWT_SECRET_ARN DB_AUTH_PASSWORD_ARN DB_ORDERS_PASSWORD_ARN
export GATEWAY_PUBLIC_URL="${GATEWAY_PUBLIC_URL:-http://localhost:8080}"

TASKDEF_TEMPLATE="$SCRIPT_DIR/../infra/ecs/task-def-${SERVICE}.json"
TASKDEF_RENDERED="/tmp/task-def-${SERVICE}.json"

echo "==> Registrando task definition: $SERVICE (imagen tag: $IMAGE_TAG)"
envsubst < "$TASKDEF_TEMPLATE" > "$TASKDEF_RENDERED"
TASK_DEF_ARN=$(aws ecs register-task-definition \
  --cli-input-json "file://$TASKDEF_RENDERED" \
  --region "$AWS_REGION" \
  --query 'taskDefinition.taskDefinitionArn' --output text)
echo "  $TASK_DEF_ARN"

if [ "$PUBLIC" == "true" ]; then
  ASSIGN_PUBLIC_IP="ENABLED"
else
  ASSIGN_PUBLIC_IP="DISABLED"
fi

IFS=',' read -ra SUBNET_ARR <<< "$SUBNET_IDS"
SUBNETS_JSON=$(printf '"%s",' "${SUBNET_ARR[@]}")
SUBNETS_JSON="[${SUBNETS_JSON%,}]"

NETWORK_CONFIG=$(cat <<EOF
{"awsvpcConfiguration":{"subnets":$SUBNETS_JSON,"securityGroups":["$SG_ID"],"assignPublicIp":"$ASSIGN_PUBLIC_IP"}}
EOF
)

SERVICE_CONNECT_CONFIG=$(cat <<EOF
{
  "enabled": true,
  "namespace": "$NAMESPACE",
  "services": [
    {
      "portName": "$CONTAINER_NAME",
      "discoveryName": "$CONTAINER_NAME",
      "clientAliases": [{"port": $CONTAINER_PORT, "dnsName": "$CONTAINER_NAME"}]
    }
  ]
}
EOF
)

SERVICE_STATUS=$(aws ecs describe-services --cluster "$CLUSTER_NAME" --services "$SERVICE" \
  --region "$AWS_REGION" --query 'services[0].status' --output text 2>/dev/null || echo "MISSING")

if [ "$SERVICE_STATUS" == "ACTIVE" ]; then
  echo "==> Actualizando servicio existente: $SERVICE"
  aws ecs update-service \
    --cluster "$CLUSTER_NAME" \
    --service "$SERVICE" \
    --task-definition "$TASK_DEF_ARN" \
    --service-connect-configuration "$SERVICE_CONNECT_CONFIG" \
    --force-new-deployment \
    --region "$AWS_REGION" >/dev/null
else
  echo "==> Creando servicio nuevo: $SERVICE"
  aws ecs create-service \
    --cluster "$CLUSTER_NAME" \
    --service-name "$SERVICE" \
    --task-definition "$TASK_DEF_ARN" \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "$NETWORK_CONFIG" \
    --service-connect-configuration "$SERVICE_CONNECT_CONFIG" \
    --region "$AWS_REGION" >/dev/null
fi

echo "==> $SERVICE desplegado. Esperando estabilización..."
aws ecs wait services-stable --cluster "$CLUSTER_NAME" --services "$SERVICE" --region "$AWS_REGION"
echo "==> $SERVICE estable."
