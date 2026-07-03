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
                    echo "🔍 Verificando conexión estricta con el contenedor Docker..."
                    sh '''
                        IS_RUNNING=$(docker inspect -f '{{.State.Running}}' $APP_NAME 2>/dev/null || echo "false")
                        if [ "$IS_RUNNING" != "true" ]; then
                            echo "❌ ERROR FATAL: El contenedor $APP_NAME está caído."
                            exit 1
                        else
                            echo "✅ El contenedor $APP_NAME está activo."
                        fi
                    '''
                }
            }
        }

        stage('Construcción y Pruebas Unitarias') {
            steps {
                echo "🔨 Compilando el proyecto..."
                // Entramos a la carpeta donde está el pom.xml
                dir('minimarket-backend') {
                    sh 'mvn -B clean verify'
                }
            }
        }

        stage('Análisis de Calidad (SonarQube)') {
            steps {
                echo "📊 Enviando código a SonarQube..."
                withSonarQubeEnv('sonar-server') {
                    dir('minimarket-backend') {
                        // Cambiado a -Dsonar.token (requisito de versiones modernas de SonarQube)
                        sh 'mvn sonar:sonar -Dsonar.token=$SONAR_AUTH_TOKEN'
                    }
                }
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                echo "🐳 Construyendo la nueva versión..."
                dir('minimarket-backend') {
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Despliegue Continuo') {
            steps {
                echo "🚀 Actualizando el contenedor..."
                // Asumiendo que el docker-compose.yml está en la raíz, 
                // si está dentro de la carpeta, agrega dir('minimarket-backend')
                sh 'docker compose up -d --build'
            }
        }

        stage('Smoke Test (Prueba de Humo)') {
            steps {
                echo "🔥 Verificando que la aplicación levantó correctamente..."
                sh 'sleep 15'
                sh 'curl -f http://localhost:8080/actuator/health'
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