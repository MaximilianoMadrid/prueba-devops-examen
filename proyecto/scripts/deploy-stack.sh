#!/bin/bash
# Despliega/actualiza el stack en el clúster Swarm.
# Ejecutar en el nodo manager, con las imágenes ya publicadas en Docker Hub.
set -e

DOCKERHUB_USER=${DOCKERHUB_USER:-smartlogix}
IMAGE_TAG=${IMAGE_TAG:-latest}

export DOCKERHUB_USER
export IMAGE_TAG

docker stack deploy -c docker-compose.yml smartlogix --with-registry-auth

echo "Stack 'smartlogix' desplegado. Verifica con: docker stack services smartlogix"
