pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
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
                    echo "🔍 Verificando conexión con el daemon Docker..."
                    sh '''
                        if ! docker info >/dev/null 2>&1; then
                            echo "❌ ERROR FATAL: Docker no está disponible en el agente."
                            exit 1
                        else
                            echo "✅ Docker está disponible en el agente."
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

        stage('Análisis de Calidad (SonarQube)') {
            steps {
                echo "📊 Enviando código a SonarQube..."
                withSonarQubeEnv('sonar-server') {
                    // Usamos expansión explícita para pasar el token al análisis
                    sh "mvn sonar:sonar -Dsonar.token=${env.SONAR_AUTH_TOKEN}"
                }
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
                sh '''
                    docker rm -f minimarket-backend minimarket-frontend 2>/dev/null || true
                '''
                sh 'docker compose up -d --build'
            }
        }

        stage('Smoke Test (Prueba de Humo)') {
            steps {
                echo "🔥 Verificando que la aplicación levantó correctamente..."
                sh '''
                    i=1
                    while [ "$i" -le 12 ]; do
                        HEALTH_STATUS=$(docker inspect -f '{{.State.Health.Status}}' $APP_NAME 2>/dev/null || echo "starting")
                        if [ "$HEALTH_STATUS" = "healthy" ]; then
                            echo "✅ El contenedor está healthy."
                            exit 0
                        fi
                        echo "⏳ Esperando a que el backend esté healthy... intento $i/12 (estado actual: $HEALTH_STATUS)"
                        sleep 5
                        i=$((i + 1))
                    done
                    echo "❌ ERROR FATAL: El backend no respondió en el tiempo esperado."
                    exit 1
                '''
            }
        }

        stage('Validar Contenedor') {
            steps {
                script {
                    echo "🔎 Verificando que el contenedor minimarket-backend quedó arriba..."
                    sh '''
                        IS_RUNNING=$(docker inspect -f '{{.State.Running}}' $APP_NAME 2>/dev/null || echo "false")
                        if [ "$IS_RUNNING" != "true" ]; then
                            echo "❌ ERROR FATAL: El contenedor $APP_NAME no quedó ejecutándose."
                            exit 1
                        else
                            echo "✅ El contenedor $APP_NAME quedó ejecutándose correctamente."
                        fi
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completado exitosamente."
        }
        failure {
            echo "❌ EL PIPELINE FALLÓ."
        }
        always {
            cleanWs()
        }
    }
}