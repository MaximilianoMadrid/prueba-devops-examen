#!/bin/bash
# Aprovisiona (idempotente) la cola SQS usada por ms-orders para notificar
# la creación de pedidos. Pensado para correr en el pipeline CI/CD o localmente
# con las credenciales de AWS Academy exportadas.
set -e

QUEUE_NAME="smartlogix-orders-queue"
REGION="${AWS_REGION:-us-east-1}"

echo "Verificando/creando cola SQS: $QUEUE_NAME en $REGION"

aws sqs create-queue \
  --queue-name "$QUEUE_NAME" \
  --region "$REGION" \
  --attributes '{
    "MessageRetentionPeriod": "86400",
    "VisibilityTimeout": "30"
  }' \
  --output text

QUEUE_URL=$(aws sqs get-queue-url --queue-name "$QUEUE_NAME" --region "$REGION" --query 'QueueUrl' --output text)
echo "Cola lista: $QUEUE_URL"
