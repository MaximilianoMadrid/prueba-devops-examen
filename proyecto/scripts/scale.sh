#!/bin/bash
# Escala un servicio del stack Swarm.
# Uso: ./scale.sh ms-orders 5
set -e
SERVICE=${1:?"Uso: ./scale.sh <servicio> <replicas>"}
REPLICAS=${2:?"Uso: ./scale.sh <servicio> <replicas>"}

docker service scale smartlogix_${SERVICE}=${REPLICAS}
docker service ls | grep smartlogix_${SERVICE}
