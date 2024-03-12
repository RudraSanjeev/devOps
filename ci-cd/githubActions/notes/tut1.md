#### CI/CD using Gitlab:

##### Basics:

- By default gitlab runner(on which our ci/cd script get executed) uses **Ruby**
- make sure to install the dependencies first to proceed further
- for ex - node app - must have npm , node , etc to run app.
- By default all the jobs runs in parallel.

- create a file in root dir named as `.gitlab-ci.yml`
  **Pipeline**:
- run test -> build image -> push it to docker hub -> deploy it to server

- In this section digital ocean is used:

```yml
variables:
  IMAGE_NAME: nanajanashia/demo-app
  IMAGE_TAG: python-app-1.0

stages:
  - test
  - build
  - deploy

run_tests:
  stage: test
  image: python:3.9-slim-buster
  before_script:
    - apt-get update && apt-get install make
  script:
    - make test

build_image:
  stage: build
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker login -u $REGISTRY_USER -p $REGISTRY_PASS
  script:
    - docker build -t $IMAGE_NAME:$IMAGE_TAG .
    - docker push $IMAGE_NAME:$IMAGE_TAG

deploy:
  stage: deploy
  before_script:
    - chmod 400 $SSH_KEY
  script:
    - ssh -o StrictHostKeyChecking=no -i $SSH_KEY root@161.35.223.117 "
      docker login -u $REGISTRY_USER -p $REGISTRY_PASS &&
      docker ps -aq | xargs docker stop | xargs docker rm &&
      docker run -d -p 5000:5000 $IMAGE_NAME:$IMAGE_TAG"
```
