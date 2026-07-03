pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
        jdk 'JDK-17'
    }

    environment {
        IMAGE_NAME = 'minimarket-backend'
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test (Maven)') {
            steps {
                sh 'mvn -B clean verify'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy (docker-compose)') {
            steps {
                sh 'docker compose down --remove-orphans || true'
                sh 'docker compose up -d --build'
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                  sleep 10
                  curl -f http://localhost:8080/actuator/health
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completado. Imagen: ${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo "❌ El pipeline falló. Revisar logs."
        }
        always {
            cleanWs()
        }
    }
}
