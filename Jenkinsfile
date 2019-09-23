properties([
    parameters([
        string(defaultValue: '', description: 'Sakiewka crypto version', name: 'CRYPTO_VERSION', trim: false)
    ])
]) 

@Library(['sml-common', 'sakiewka-jenkins-library']) _

podFactory.withNode10 {
    podFactory.withHelm {
        podFactory.withDind {
            podFactory.withSakiewkaSettings {
                node(POD_LABEL) {
                    dockerRepository = "softwaremill/sakiewka-crypto-local"
                    stage('Checkout') {
                        checkout scm
                        gitCommitHash = git.getShortCommitHash()
                        cryptoVersion = params.CRYPTO_VERSION
                        cryptoVersionDefined = cryptoVersion != null && cryptoVersion.length() > 0
                    }
                    stage('Execute test') {
                        container('node10') {
                            if(cryptoVersionDefined) {
                                sh "npm install softwaremill/sakiewka-crypto#$cryptoVersion"
                            }
                            sh """
                            npm ci
                            npm test
                            """
                        }
                    }
                    if(!cryptoVersionDefined) {
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
                    }
                }
            }
        }
    }
}