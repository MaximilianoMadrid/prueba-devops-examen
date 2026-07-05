#!/bin/bash
# Aprovisiona (idempotente) los recursos AWS necesarios para desplegar
# SmartLogix en ECS Fargate: ECR, cluster, log groups, secretos, namespace
# de Service Connect y security group. Pensado para correr en el pipeline
# CI/CD o localmente con credenciales de AWS Academy exportadas.
#
# Al finalizar escribe scripts/.ecs-runtime.env con los valores descubiertos
# (cuenta, subredes, security group, ARNs de rol/secretos) para que
# ecs-deploy-service.sh los reutilice sin tener que redescubrirlos.
set -euo pipefail

REGION="${AWS_REGION:-us-east-1}"
CLUSTER_NAME="smartlogix-cluster"
NAMESPACE="smartlogix.local"
SG_NAME="smartlogix-ecs-sg"
REPO_PREFIX="smartlogix"
SERVICES_ECR=(ms-auth ms-orders api-gateway frontend)
LOG_SERVICES=(db-auth db-orders ms-auth ms-orders api-gateway frontend)

echo "==> Cuenta AWS y región"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "Cuenta: $ACCOUNT_ID | Región: $REGION"

echo "==> Rol de ejecución/tarea (AWS Academy: LabRole)"
if aws iam get-role --role-name LabRole >/dev/null 2>&1; then
  EXECUTION_ROLE_ARN=$(aws iam get-role --role-name LabRole --query 'Role.Arn' --output text)
else
  EXECUTION_ROLE_ARN=$(aws iam get-role --role-name ecsTaskExecutionRole --query 'Role.Arn' --output text)
fi
echo "Rol: $EXECUTION_ROLE_ARN"

echo "==> Repositorios ECR"
for svc in "${SERVICES_ECR[@]}"; do
  if ! aws ecr describe-repositories --repository-names "$REPO_PREFIX/$svc" --region "$REGION" >/dev/null 2>&1; then
    aws ecr create-repository --repository-name "$REPO_PREFIX/$svc" --region "$REGION" \
      --image-scanning-configuration scanOnPush=true >/dev/null
    echo "  creado: $REPO_PREFIX/$svc"
  else
    echo "  ya existe: $REPO_PREFIX/$svc"
  fi
done
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "==> Log groups de CloudWatch"
for svc in "${LOG_SERVICES[@]}"; do
  LOG_GROUP="/ecs/smartlogix/$svc"
  if ! aws logs describe-log-groups --log-group-name-prefix "$LOG_GROUP" --region "$REGION" \
        --query "logGroups[?logGroupName=='$LOG_GROUP']" --output text | grep -q "$LOG_GROUP"; then
    aws logs create-log-group --log-group-name "$LOG_GROUP" --region "$REGION"
    aws logs put-retention-policy --log-group-name "$LOG_GROUP" --retention-in-days 7 --region "$REGION"
    echo "  creado: $LOG_GROUP"
  else
    echo "  ya existe: $LOG_GROUP"
  fi
done

echo "==> Secretos en AWS Secrets Manager"
create_secret_if_missing () {
  local name="$1"
  if ! aws secretsmanager describe-secret --secret-id "$name" --region "$REGION" >/dev/null 2>&1; then
    aws secretsmanager create-secret --name "$name" --region "$REGION" \
      --generate-secret-string 'SecretStringTemplate={},GenerateStringKey=password,PasswordLength=24,ExcludePunctuation=true' \
      >/dev/null
    echo "  creado: $name"
  else
    echo "  ya existe: $name"
  fi
}
create_secret_if_missing "smartlogix/jwt-secret"
create_secret_if_missing "smartlogix/db-auth-password"
create_secret_if_missing "smartlogix/db-orders-password"

# Los task definitions esperan el valor "en crudo" de la contraseña, no un JSON,
# así que referenciamos la clave "password" dentro del secreto con ":password::"
JWT_SECRET_ARN="$(aws secretsmanager describe-secret --secret-id smartlogix/jwt-secret --region "$REGION" --query ARN --output text):password::"
DB_AUTH_PASSWORD_ARN="$(aws secretsmanager describe-secret --secret-id smartlogix/db-auth-password --region "$REGION" --query ARN --output text):password::"
DB_ORDERS_PASSWORD_ARN="$(aws secretsmanager describe-secret --secret-id smartlogix/db-orders-password --region "$REGION" --query ARN --output text):password::"

echo "==> Cluster ECS (Fargate)"
CLUSTER_STATUS=$(aws ecs describe-clusters --clusters "$CLUSTER_NAME" --region "$REGION" \
  --query 'clusters[0].status' --output text 2>/dev/null || echo "MISSING")
if [ "$CLUSTER_STATUS" != "ACTIVE" ]; then
  aws ecs create-cluster --cluster-name "$CLUSTER_NAME" --region "$REGION" >/dev/null
  echo "  creado: $CLUSTER_NAME"
else
  echo "  ya existe: $CLUSTER_NAME"
fi

echo "==> Red (VPC por defecto, subredes públicas, security group)"
VPC_ID=$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true --region "$REGION" \
  --query 'Vpcs[0].VpcId' --output text)
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --region "$REGION" \
  --query 'Subnets[].SubnetId' --output text | tr '\t' ',')
echo "  VPC: $VPC_ID | Subredes: $SUBNET_IDS"

SG_ID=$(aws ec2 describe-security-groups --region "$REGION" \
  --filters "Name=group-name,Values=$SG_NAME" "Name=vpc-id,Values=$VPC_ID" \
  --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo "None")
if [ "$SG_ID" == "None" ] || [ -z "$SG_ID" ]; then
  SG_ID=$(aws ec2 create-security-group --group-name "$SG_NAME" \
    --description "SmartLogix ECS tasks" --vpc-id "$VPC_ID" --region "$REGION" \
    --query 'GroupId' --output text)
  aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 8080 \
    --cidr 0.0.0.0/0 --region "$REGION" >/dev/null
  aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 3000 \
    --cidr 0.0.0.0/0 --region "$REGION" >/dev/null
  aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol all \
    --source-group "$SG_ID" --region "$REGION" >/dev/null
  echo "  creado: $SG_ID"
else
  echo "  ya existe: $SG_ID"
fi

echo "==> Namespace de Service Connect (Cloud Map, DNS privado en la VPC)"
NS_ID=$(aws servicediscovery list-namespaces --region "$REGION" \
  --query "Namespaces[?Name=='$NAMESPACE'].Id" --output text)
if [ -z "$NS_ID" ]; then
  OP_ID=$(aws servicediscovery create-private-dns-namespace --name "$NAMESPACE" \
    --vpc "$VPC_ID" --region "$REGION" --query 'OperationId' --output text)
  echo "  creando namespace $NAMESPACE (operación $OP_ID)..."
  aws servicediscovery get-operation --operation-id "$OP_ID" --region "$REGION" >/dev/null
else
  echo "  ya existe: $NAMESPACE ($NS_ID)"
fi

echo "==> Cola SQS (usada por ms-orders)"
chmod +x "$(dirname "$0")/provision-sqs.sh"
AWS_REGION="$REGION" "$(dirname "$0")/provision-sqs.sh"

cat > "$(dirname "$0")/.ecs-runtime.env" <<EOF
AWS_ACCOUNT_ID=$ACCOUNT_ID
AWS_REGION=$REGION
ECR_REGISTRY=$ECR_REGISTRY
EXECUTION_ROLE_ARN=$EXECUTION_ROLE_ARN
CLUSTER_NAME=$CLUSTER_NAME
NAMESPACE=$NAMESPACE
VPC_ID=$VPC_ID
SUBNET_IDS=$SUBNET_IDS
SG_ID=$SG_ID
JWT_SECRET_ARN=$JWT_SECRET_ARN
DB_AUTH_PASSWORD_ARN=$DB_AUTH_PASSWORD_ARN
DB_ORDERS_PASSWORD_ARN=$DB_ORDERS_PASSWORD_ARN
EOF

echo "==> Listo. Variables descubiertas guardadas en scripts/.ecs-runtime.env"
