# SmartLogix - Despliegue Cloud (EP3)

Alcance de esta evaluación: `ms-auth`, `ms-orders` y `api-gateway`.

> ⚠️ **Estructura del repo**: `.github/workflows/ci-cd.yml` vive en la **raíz del repositorio** (al mismo nivel que esta carpeta `proyecto/`), no dentro de `proyecto/`. GitHub Actions solo detecta workflows en `<raiz-del-repo>/.github/workflows/`. Si al subir a GitHub terminas usando `proyecto/` como raíz del repo, mueve `.github/` a esa raíz y ajusta las rutas del workflow (`proyecto/microservicios/...` → `microservicios/...`).

## 1. Ejecutar en local (sin Swarm)

```bash
cd proyecto
docker compose up --build
```

- Gateway: http://localhost:8080
- Auth (vía gateway): http://localhost:8080/api/auth/**
- Orders (vía gateway): http://localhost:8080/api/orders/**

## 2. Docker Swarm

### 2.1 Inicializar el clúster (en el nodo manager)

```bash
cd proyecto/scripts
./swarm-init.sh
```

Esto imprime un token de tipo `docker swarm join --token ... <IP>:2377`.

### 2.2 Agregar un nodo worker

En la otra máquina (o instancia EC2), ejecutar el comando entregado por el paso anterior:

```bash
docker swarm join --token SWMTKN-1-xxxxxxxx <IP_MANAGER>:2377
```

Verificar en el manager:

```bash
docker node ls
```

### 2.3 Desplegar el stack

```bash
cd proyecto
export DOCKERHUB_USER=<tu_usuario_dockerhub>
export IMAGE_TAG=latest
./scripts/deploy-stack.sh
```

### 2.4 Escalar un servicio

```bash
./scripts/scale.sh ms-orders 5
docker service ls
```

## 3. Pipeline CI/CD (GitHub Actions)

Definido en `.github/workflows/ci-cd.yml`. Etapas:

1. **build-test**: `mvn clean verify` para los 3 componentes.
2. **build-push-images**: construye y publica las imágenes en Docker Hub.
3. **provision-cloud**: crea/asegura la cola SQS `smartlogix-orders-queue` vía AWS CLI (IaC), usando credenciales temporales de AWS Academy.
4. **deploy-swarm**: copia el `docker-compose.yml` al manager Swarm (EC2) por SSH y ejecuta `docker stack deploy`.

### Secrets necesarios en GitHub (Settings > Secrets and variables > Actions)

| Secret | Descripción |
|---|---|
| `DOCKERHUB_USERNAME` | Usuario de Docker Hub |
| `DOCKERHUB_TOKEN` | Access token de Docker Hub |
| `AWS_ACCESS_KEY_ID` | Del Learner Lab (AWS Details > AWS CLI) |
| `AWS_SECRET_ACCESS_KEY` | Del Learner Lab |
| `AWS_SESSION_TOKEN` | Del Learner Lab (⚠️ expira ~4h, hay que actualizarlo antes de cada demo) |
| `SWARM_MANAGER_HOST` | IP pública de la EC2 manager |
| `SWARM_MANAGER_USER` | Usuario SSH (ej. `ubuntu` o `ec2-user`) |
| `SWARM_MANAGER_SSH_KEY` | Llave privada .pem del par de claves de la EC2 |

## 4. Notas importantes

- **`depends_on: condition: service_healthy`** solo lo respeta `docker compose up` (local). `docker stack deploy` en Swarm lo ignora y arranca todo en paralelo; por eso cada servicio tiene `restart_policy: on-failure`, así si `ms-auth`/`ms-orders` arrancan antes que su base de datos, Swarm los reinicia automáticamente hasta que logran conectar.
- **Perfiles Spring**: `application.yml` de `api-gateway` usa los hostnames de Docker (`ms-auth`, `ms-orders`) por defecto, pensado para correr en contenedores. Para correr el gateway desde el IDE fuera de Docker, activa el perfil `local` (usa `application-local.yml`, con `localhost`):
  ```bash
  mvn spring-boot:run -Dspring-boot.run.profiles=local
  ```
- **Compilación real**: este entorno de análisis no tiene acceso a Maven Central, por lo que no pude ejecutar `mvn clean verify` aquí. Se recomienda correrlo localmente antes de la demo para confirmar que no hay errores de compilación.

## 5. Decisiones técnicas (resumen para IE9)

- **Réplicas ms-auth/ms-orders = 2**: alta disponibilidad ante caída de un contenedor; el gateway sigue enrutando al réplica sano.
- **Red overlay `smartlogix-net`**: permite comunicación entre servicios en distintos nodos del clúster Swarm por nombre de servicio (`ms-auth`, `ms-orders`), sin exponer los microservicios al exterior.
- **Solo el `api-gateway` publica puerto (8080)**: reduce superficie de ataque; el backend queda protegido detrás del gateway.
- **Bases de datos separadas por servicio** (`db-auth`, `db-orders`): respeta el patrón *database-per-service* de microservicios.
- **Healthchecks + `restart_policy: on-failure`**: Swarm reinicia automáticamente contenedores caídos, aportando mantenibilidad.
