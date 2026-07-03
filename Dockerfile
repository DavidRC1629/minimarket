# =========================================================
# STAGE 1: Build - compila el proyecto con Maven
# =========================================================
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copiamos primero el pom.xml para aprovechar la caché de capas de Docker.
# Si las dependencias no cambian, Docker no volverá a descargarlas.
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copiamos el código fuente y compilamos (sin ejecutar tests aquí;
# los tests se corren en una etapa previa del pipeline de Jenkins)
COPY src ./src
RUN mvn -B clean package -DskipTests

# =========================================================
# STAGE 2: Runtime - imagen liviana solo con el JRE
# =========================================================
FROM eclipse-temurin:17-jre-alpine AS runtime

# Buenas prácticas: usuario no-root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

WORKDIR /app

# Copiamos únicamente el jar generado en la etapa de build
COPY --from=build /app/target/minimarket.jar app.jar

EXPOSE 8080

# Healthcheck usando el endpoint de Actuator
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health | grep -q '"status":"UP"' || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
