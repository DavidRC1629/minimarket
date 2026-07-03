# Minimarket API

Sistema simple de gestión de minimarket (Categorías, Productos y Ventas) construido con **Spring Boot 3 + Java 17 + H2**, diseñado como base para una demo de **CI/CD con Docker y Jenkins**.

## Stack

- Java 17
- Spring Boot 3.3.2 (Web, Data JPA, Validation, Actuator)
- H2 Database (en memoria)
- Lombok
- Maven
- Docker / Docker Compose

## Estructura

```
src/main/java/com/minimarket
├── controller     # Endpoints REST
├── service        # Lógica de negocio
├── repository     # Acceso a datos (Spring Data JPA)
├── entity         # Categoria, Producto, Venta
├── dto            # VentaRequest
└── exception      # Manejo global de errores
```

## Ejecutar localmente (sin Docker)

```bash
mvn spring-boot:run
```

La API queda disponible en `http://localhost:8080`.
Consola H2: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:minimarketdb`
  - User: `sa` / Password: *(vacío)*

## Ejecutar tests

```bash
mvn test
```

## Ejecutar con Docker

```bash
docker compose up --build
```

Esto construye la imagen (multi-stage: build con Maven, runtime con JRE) y levanta el contenedor en `http://localhost:8080`. No requiere ningún otro servicio (la base de datos H2 vive dentro de la propia app).

## Endpoints principales

| Método | Endpoint               | Descripción                  |
|--------|-------------------------|-------------------------------|
| GET    | /api/categorias         | Listar categorías             |
| POST   | /api/categorias         | Crear categoría               |
| GET    | /api/productos          | Listar productos              |
| GET    | /api/productos/{id}     | Obtener producto               |
| POST   | /api/productos          | Crear producto                |
| PUT    | /api/productos/{id}     | Actualizar producto            |
| DELETE | /api/productos/{id}     | Eliminar producto              |
| POST   | /api/ventas             | Registrar una venta            |
| GET    | /api/ventas             | Listar ventas                  |
| GET    | /actuator/health        | Healthcheck (usado por Docker) |

### Ejemplo: registrar una venta

```bash
curl -X POST http://localhost:8080/api/ventas \
  -H "Content-Type: application/json" \
  -d '{"productoId": 1, "cantidad": 3}'
```

## CI/CD

El repositorio incluye un `Jenkinsfile` de ejemplo con las etapas: checkout → build & test (Maven) → build de imagen Docker → despliegue con `docker compose` → smoke test contra `/actuator/health`.
