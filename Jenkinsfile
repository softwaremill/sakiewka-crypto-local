#!/usr/bin/env groovy

@Library('sml-common')

String getGitCommitHash() {
    return sh(script: 'git rev-parse HEAD', returnStdout: true)?.trim()
}

def label = "dind-${UUID.randomUUID().toString()}"
def serviceAccount = "jenkins"
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
                sh """
                set -e
                npm ci
                npm test
                """
            }
            container('dind') {
                stage('Build docker image') {
                    sh"""npm dockerPublishLocal"""
                }
                stage('Push to Docker Hub') {
                    withCredentials([usernamePassword(
                            credentialsId: 'jenkins-dockerhub',
                            passwordVariable: 'DOCKERHUB_PASSWORD',
                            usernameVariable: 'DOCKERHUB_USERNAME')]) {
                        if (env.BRANCH_NAME == 'master') {
                            sh"""
                               docker login -u \\$DOCKERHUB_USERNAME -p \\$DOCKERHUB_PASSWORD
                               npm dockerPush
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