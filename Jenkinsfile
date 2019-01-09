#!/usr/bin/env groovy

@Library('sml-common')

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
        try{
            stage('Execute test') {
                container('node10') {
                    sh """
                    set -e
                    npm ci
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
                stage('Push to Docker Hub') {
                    withCredentials([usernamePassword(
                            credentialsId: 'jenkins-dockerhub',
                            passwordVariable: 'DOCKERHUB_PASSWORD',
                            usernameVariable: 'DOCKERHUB_USERNAME')]) {
                        sh """
                            set -e
                            docker login -u \$DOCKERHUB_USERNAME -p \$DOCKERHUB_PASSWORD
                        """
                        if (env.BRANCH_NAME == 'master') {
                            sh """
                                docker push ${dockerRepository}:${gitCommitHash}
                                docker push ${dockerRepository}:latest
                            """
                        } else {
                            def safeBranchName = env.BRANCH_NAME.replace('/', '-')
                            sh """
                                docker tag ${dockerRepository}:latest ${dockerRepository}:${safeBranchName}
                                docker push ${dockerRepository}:${safeBranchName}
                            """
                        }
                    }
                }
            }
        } catch(e) {
            currentBuild.result = 'FAILED'
            throw e
        } finally {
            slackNotify(
                 buildStatus: currentBuild.currentResult,
                 slackChannel: "#sakiewka",
                 slackTeam: "softwaremill",
                 slackTokenCredentialId: 'sml-slack-token')
        }
    }
}