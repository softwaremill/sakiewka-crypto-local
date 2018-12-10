#!/usr/bin/env groovy

String getGitCommitHash() {
    return sh(script: 'git rev-parse HEAD', returnStdout: true)?.trim()
}

def label = "dind-node10-${UUID.randomUUID().toString()}"
def serviceAccount = "icouhouse-jenkins"
podTemplate(label: label, yaml: """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: ${serviceAccount}
  containers:
  - name: dind
    image: docker:stable-dind
    securityContext: 
        privileged: true
        runAsUser: 0
  - name: node10
    image: node:10
    command:
        - cat
    tty: true
"""
) {
    node(label) {
        dockerRepository = "softwaremill/sakiewka-crypto-local"
        stage('Checkout') {
            checkout scm
            gitCommitHash = getGitCommitHash()
        }
        stage('Execute test') {
            container('node10') {
                sh """
                set -e
                npm install
                npm test
                """
            }
        }
        container('dind') {
            stage('Build docker image') {
                sh """
                set -e
                docker build . -t ${dockerRepository}:${gitCommitHash} -t ${dockerRepository}:latest
                """
            }
            if (env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'feature/pipeline') {
                stage('Push to Docker Hub') {
                    withCredentials([usernamePassword(
                            credentialsId: 'jenkins-dockerhub',
                            passwordVariable: 'DOCKERHUB_PASSWORD',
                            usernameVariable: 'DOCKERHUB_USERNAME')]) {
                        sh """
                            set -e
                            docker login -u \$DOCKERHUB_USERNAME -p \$DOCKERHUB_PASSWORD
                            docker push ${dockerRepository}:${gitCommitHash}
                            docker push ${dockerRepository}:latest
                        """
                    }
                }
            }
        }
    }
}