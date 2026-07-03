pipeline {
    agent any

    tools {
        maven 'Maven-3.9' // Asegúrate de que el nombre coincida con el configurado en Jenkins > Global Tool Configuration
        jdk 'JDK-17'
    }

    environment {
        APP_NAME = 'minimarket-backend'
        IMAGE_NAME = 'minimarket-backend:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Auditoría de Entorno (Regla del Profesor)') {
            steps {
                script {
                    echo "🔍 Verificando conexión estricta con el contenedor Docker..."
                    // Este script bash hace que el pipeline FALLE (exit 1) si tumbaste el contenedor
                    sh '''
                        IS_RUNNING=$(docker inspect -f '{{.State.Running}}' $APP_NAME 2>/dev/null || echo "false")
                        if [ "$IS_RUNNING" != "true" ]; then
                            echo "❌ ERROR FATAL: El contenedor $APP_NAME está caído, no existe o fue alterado."
                            echo "El pipeline no puede continuar en un entorno roto."
                            exit 1
                        else
                            echo "✅ El contenedor $APP_NAME está activo y conectado al pipeline."
                        fi
                    '''
                }
            }
        }

        stage('Construcción y Pruebas Unitarias') {
            steps {
                echo "🔨 Compilando el proyecto..."
                sh 'mvn -B clean verify'
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                echo "🐳 Construyendo la nueva versión..."
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Despliegue Continuo') {
            steps {
                echo "🚀 Actualizando el contenedor..."
                // Levantamos la nueva versión
                sh 'docker compose up -d --build'
            }
        }

        stage('Smoke Test (Prueba de Humo)') {
            steps {
                echo "🔥 Verificando que la aplicación levantó correctamente..."
                // Le damos 15 segundos a Spring Boot para levantar
                sh 'sleep 15'
                // Si el healthcheck no responde un HTTP 200, esto falla y el pipeline se pone en rojo
                sh 'curl -f http://localhost:8080/actuator/health'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completado exitosamente. Entorno Docker auditado y actualizado."
        }
        failure {
            echo "❌ EL PIPELINE FALLÓ. El entorno Docker fue alterado o el código tiene errores."
        }
        always {
            cleanWs()
        }
    }
}