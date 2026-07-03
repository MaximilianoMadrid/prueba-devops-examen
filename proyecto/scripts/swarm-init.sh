#!/bin/bash
# Inicializa este nodo como manager de Docker Swarm.
# Ejecutar en la máquina que actuará como manager (ej. EC2 de AWS Academy).
set -e

IP_ADDR=$(hostname -I | awk '{print $1}')
echo "Inicializando Swarm con IP advertise: $IP_ADDR"

docker swarm init --advertise-addr "$IP_ADDR"

echo ""
echo "Manager listo. Para agregar un worker, copia y ejecuta en el otro nodo:"
docker swarm join-token worker
