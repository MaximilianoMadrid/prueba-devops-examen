#!/bin/bash
# Este script se genera con el output de 'docker swarm join-token worker'
# ejecutado en el nodo manager (ver swarm-init.sh).
# Ejemplo de uso en el nodo worker:
#   docker swarm join --token SWMTKN-1-xxxxxxxx <IP_MANAGER>:2377
echo "Ejecuta en el nodo worker el comando entregado por 'docker swarm join-token worker' en el manager."
