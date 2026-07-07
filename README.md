# SmartLogix - Despliegue Cloud (EP3)

Alcance de esta evaluación: `frontend`, `ms-auth`, `ms-orders` y `api-gateway`.
(`ms-inventory`, `ms-notification`, `ms-shipping`, `ms-tracking` existen en el
repo pero no forman parte de esta entrega).

> ⚠️ **Estructura del repo**: `.github/workflows/ci-cd.yml` vive en la **raíz del repositorio** (al mismo nivel que esta carpeta `proyecto/`), no dentro de `proyecto/`. GitHub Actions solo detecta workflows en `<raiz-del-repo>/.github/workflows/`. Si al subir a GitHub terminas usando `proyecto/` como raíz del repo, mueve `.github/` a esa raíz y ajusta las rutas del workflow (`proyecto/microservicios/...` → `microservicios/...`).

## Arquitectura

```
                     ┌─────────────┐
        Internet ──▶ │  frontend    │  (puerto 3000, IP pública)
                     └─────────────┘
                             │  (llamado directo aún no implementado)
                     ┌─────────────┐
        Internet ──▶ │ api-gateway  │  (puerto 8080, IP pública)
                     └──────┬──────┘
                Service Connect DNS interno (smartlogix.local)
                ┌───────────┴────────────┐
        ┌───────▼──────┐          ┌──────▼───────┐
        │   ms-auth     │          │  ms-orders    │
        │  (8081)       │          │  (8082)       │
        └───────┬──────┘          └──────┬───────┘
        ┌───────▼──────┐          ┌──────▼───────┐
        │   db-auth     │          │  db-orders    │
        │ (postgres)    │          │ (postgres)    │
        └──────────────┘          └──────────────┘
```

- **Local (desarrollo)**: `docker-compose.yml` levanta todo en una red `bridge` local.
- **Nube (producción)**: cada servicio corre como un **servicio ECS Fargate**
  independiente dentro del clúster `smartlogix-cluster`. La comunicación
  interna entre servicios (`api-gateway → ms-auth/ms-orders`, `ms-auth → db-auth`,
  etc.) se resuelve por DNS con **ECS Service Connect**, sin necesidad de IPs
  fijas ni un balanceador para el tráfico interno.

## 1. Ejecutar en local

```bash
cd proyecto
docker compose up --build
```

- Frontend: http://localhost:3000
- Gateway: http://localhost:8080
- Auth (vía gateway): http://localhost:8080/api/auth/**
- Orders (vía gateway): http://localhost:8080/api/orders/**

## 2. Despliegue en AWS (ECS Fargate)

El despliegue en la nube ya no usa Docker Swarm ni instancias EC2 administradas
a mano: se orquesta con **Amazon ECS Fargate** (serverless, sin gestionar
servidores). Los recursos se definen en `infra/ecs/*.json` (task definitions)
y se aprovisionan/despliegan con los scripts en `scripts/`.

### 2.1 Aprovisionar infraestructura (una vez, o cuando cambie algo estructural)

Crea de forma idempotente: repositorios ECR, cluster ECS, log groups de
CloudWatch, secretos en Secrets Manager, namespace de Service Connect,
security group y la cola SQS.

```bash
cd proyecto
export AWS_REGION=us-east-1
./scripts/ecs-provision.sh
```

Esto genera `scripts/.ecs-runtime.env` con los IDs descubiertos (cuenta, VPC,
subredes, security group, ARNs de secretos). Ese archivo **no se versiona**
(está en `.gitignore`) porque cambia por cuenta/región.

### 2.2 Construir y publicar las imágenes en ECR

```bash
source scripts/.ecs-runtime.env
for svc in ms-auth microservicios/ms-orders api-gateway frontend; do :; done
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

docker build -t $ECR_REGISTRY/smartlogix/ms-auth:latest microservicios/ms-auth
docker push $ECR_REGISTRY/smartlogix/ms-auth:latest

docker build -t $ECR_REGISTRY/smartlogix/ms-orders:latest microservicios/ms-orders
docker push $ECR_REGISTRY/smartlogix/ms-orders:latest

docker build -t $ECR_REGISTRY/smartlogix/api-gateway:latest api-gateway
docker push $ECR_REGISTRY/smartlogix/api-gateway:latest

docker build -t $ECR_REGISTRY/smartlogix/frontend:latest frontend
docker push $ECR_REGISTRY/smartlogix/frontend:latest
```

(En el pipeline de GitHub Actions esto ocurre automáticamente en el job `build-push-images`).

### 2.3 Desplegar los servicios en ECS

```bash
export IMAGE_TAG=latest
./scripts/ecs-deploy-service.sh db-auth      db-auth      5432 false
./scripts/ecs-deploy-service.sh db-orders    db-orders    5432 false
./scripts/ecs-deploy-service.sh ms-auth      ms-auth      8081 false
./scripts/ecs-deploy-service.sh ms-orders    ms-orders    8082 false
./scripts/ecs-deploy-service.sh api-gateway  api-gateway  8080 true
./scripts/ecs-deploy-service.sh frontend     frontend     3000 true
```

El script registra una nueva revisión de la task definition y crea el
servicio (si no existe) o lo actualiza con `--force-new-deployment` (si ya
existe), habilitando Service Connect para que los demás servicios lo
resuelvan por nombre.

### 2.4 Escalar un servicio

```bash
./scripts/ecs-scale.sh ms-orders 3
```

### 2.5 Ver el estado / logs

```bash
source scripts/.ecs-runtime.env
aws ecs describe-services --cluster $CLUSTER_NAME --services api-gateway --region $AWS_REGION
aws logs tail /ecs/smartlogix/api-gateway --follow --region $AWS_REGION
```

Para obtener la IP pública del `api-gateway` o `frontend` (Fargate asigna una
IP nueva en cada despliegue, ya que no hay un Load Balancer delante):

```bash
TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name api-gateway --region $AWS_REGION --query 'taskArns[0]' --output text)
ENI_ID=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN --region $AWS_REGION --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)
aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID --region $AWS_REGION --query 'NetworkInterfaces[0].Association.PublicIp' --output text
```

## 3. Pipeline CI/CD (GitHub Actions)

Definido en `.github/workflows/ci-cd.yml`. Etapas:

1. **build-test-java**: `mvn clean verify` para `ms-auth`, `ms-orders`, `api-gateway`.
2. **build-test-frontend**: `pnpm install` + `pnpm build` del frontend.
3. **provision-infra**: corre `ecs-provision.sh` (ECR, cluster, logs, secretos, red, SQS) y sube el archivo de variables resultante como artifact.
4. **build-push-images**: construye y publica las 4 imágenes en **Amazon ECR**.
5. **deploy-ecs**: descarga el artifact de variables y corre `ecs-deploy-service.sh` para cada servicio, en orden (bases de datos → microservicios → gateway/frontend).

### Secrets necesarios en GitHub (Settings > Secrets and variables > Actions)

| Secret | Descripción |
|---|---|
| `AWS_ACCESS_KEY_ID` | Del Learner Lab (AWS Details > AWS CLI) |
| `AWS_SECRET_ACCESS_KEY` | Del Learner Lab |
| `AWS_SESSION_TOKEN` | Del Learner Lab (⚠️ expira ~4h, hay que actualizarlo antes de cada demo/ejecución del pipeline) |

Ya no se necesitan `DOCKERHUB_*` ni `SWARM_MANAGER_*`: las imágenes van a ECR
y el despliegue es 100% vía API de AWS (sin SSH a ninguna instancia).

## 4. Gestión de secretos y configuración

- **JWT y contraseñas de BD**: viven en **AWS Secrets Manager** (`smartlogix/jwt-secret`,
  `smartlogix/db-auth-password`, `smartlogix/db-orders-password`), creados por
  `ecs-provision.sh` con un valor aleatorio. Las task definitions los inyectan
  como variables de entorno mediante el bloque `secrets` (no quedan en texto
  plano en ningún archivo versionado).
- **Rol de ejecución/tarea**: se usa el rol `LabRole` que ya existe en cada
  cuenta de AWS Academy (principio de mínimo privilegio limitado por lo que
  Academy permite; en una cuenta propia se recomendaría un rol dedicado más
  restrictivo).
- **Variables no sensibles** (URLs internas, nombres de BD): van directas como
  `environment` en las task definitions.
- **Para correr localmente**: `docker-compose.yml` usa valores por defecto
  (`1234`, secreto de ejemplo) sobreescribibles con un archivo `.env`.

## 5. Notas importantes

- **`depends_on: condition: service_healthy`** solo aplica a `docker compose up` (local). En ECS, cada servicio arranca de forma independiente; por eso los microservicios tienen healthchecks propios y ECS los reinicia si fallan.
- **Perfiles Spring**: `api-gateway` resuelve las URIs de `ms-auth`/`ms-orders` mediante las variables `MS_AUTH_URI` / `MS_ORDERS_URI` (por defecto apuntan a los hostnames de Docker Compose; en ECS se sobreescriben a los nombres de Service Connect, ej. `http://ms-auth.smartlogix.local:8081`). Para correr el gateway desde el IDE fuera de Docker, usa el perfil `local`:
  ```bash
  mvn spring-boot:run -Dspring-boot.run.profiles=local
  ```
- **Persistencia de las bases de datos en Fargate**: por simplicidad, `db-auth`/`db-orders` corren como tareas Fargate con almacenamiento efímero (se pierde si la tarea se reinicia). Es una limitación conocida y aceptable para esta entrega/demo; la mejora natural a futuro es migrar a **Amazon RDS**.
- **IP pública dinámica**: como no hay un Load Balancer delante de `api-gateway`/`frontend`, la IP pública cambia en cada despliegue. Ver sección 2.5 para obtenerla. Una mejora futura es agregar un Application Load Balancer con DNS estable.
- **Frontend**: hoy es un dashboard estático de demostración (no hace `fetch`/`axios` real hacia el gateway todavía); `NEXT_PUBLIC_API_URL` queda declarada para cuando se conecte la integración real.

## 6. Decisiones técnicas (resumen)

- **ECS Fargate en vez de Docker Swarm/EC2 manual**: cumple el requisito de orquestación gestionada en la nube (EKS/ECS/AKS/GKE), sin administrar servidores ni parches de SO, con escalado (`ecs-scale.sh`) y auto-recuperación nativos del servicio.
- **Service Connect** en vez de IPs fijas o un Load Balancer interno: DNS interno simple (`ms-auth.smartlogix.local`) para la comunicación entre microservicios.
- **Un servicio ECS por componente**: aísla el ciclo de vida y el escalado de cada pieza (se puede escalar `ms-orders` sin tocar `ms-auth`).
- **Solo `api-gateway` y `frontend` con IP pública**: reduce superficie de ataque; el resto de los servicios solo son alcanzables dentro de la VPC.
- **Bases de datos separadas por servicio** (`db-auth`, `db-orders`): respeta el patrón *database-per-service* de microservicios.
- **Secrets Manager para credenciales**: evita hardcodear contraseñas/JWT en el código o en las task definitions.
