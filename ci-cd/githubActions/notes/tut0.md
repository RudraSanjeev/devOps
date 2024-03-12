#### CI/CD Pipeline using Github Action:

##### Basics:

1. events
2. jobs
3. secret

#### single app ci/cd of angular-app .yml file:

```yaml
name: Publish Docker image

on:
  push:
    branches: ["master"]

jobs:
  push_to_registry:
    name: Push Docker image to Docker Hub
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repo
        uses: actions/checkout@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          tags: rudrasanjeev/angular-demo:latest # Specify the tag for your Docker image
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
```

#### full stack app with docker compose ci/cd:

- first see the structure of project:
- docker-compose file should be in root dir

**For the first time you need to build and push to docker hub mannually.**

#### for the first time compose.yml

```yml
version: "3.9"

services:
  # MongoDB service
  mongo_db:
    container_name: db_container
    image: mongo:latest
    restart: always
    volumes:
      - mongo_db:/data/db

  # Angular web service
  web:
    build: demo3
    ports:
      - 4200:4200
    volumes:
      - ./demo3:/app/client
    depends_on:
      - mongo_db

  # Node API service
  api:
    build: demo1
    ports:
      - 4000:8000
    environment:
      PORT: 8000
      MONGO_URI: mongodb://mongo_db:27017/
      DB_NAME: my_db
    volumes:
      - ./demo1:/app/api
    depends_on:
      - mongo_db

volumes:
  mongo_db: {}
```

#### second time onwards compose.yml

- for the second time onwards you just commit and push. Github action will auto push to the docker hub.

```yml
version: "3.9"

services:
  # MongoDB service
  mongo_db:
    container_name: db_container
    image: rudrasanjeev/mongo
    restart: always
    volumes:
      - mongo_db:/data/db

  # Angular web service
  web:
    build: demo3
    image: rudrasanjeev/fullstack-demo-web
    ports:
      - 4200:4200
    volumes:
      - ./demo3:/app/client
    depends_on:
      - mongo_db

  # Node API service
  api:
    build: demo1
    image: rudrasanjeev/fullstack-demo-api
    ports:
      - 4000:8000
    environment:
      PORT: 8000
      MONGO_URI: mongodb://mongo_db:27017/
      DB_NAME: my_db
    volumes:
      - ./demo1:/app/api
    depends_on:
      - mongo_db

volumes:
  mongo_db: {}
```

#### this is not tested but have to test:

- workflow file to run test and auto deploy it to ECS or EKS

```yml
name: Continuous Integration and Deployment

on:
  push:
    branches:
      - master

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build Docker image
        run: docker build -t rudrasanjeev/angular-demo:latest .

      - name: Push Docker image to Docker Hub
        run: docker push rudrasanjeev/angular-demo:latest

      # Add your tests here, if needed
      - name: Run tests
        run: |
          # Add your test commands here
          # Example: npm test

      - name: Deploy to ECS
        if: success()
        run: |
          # Update ECS service
          aws ecs update-service \
            --cluster your_cluster_name \
            --service your_service_name \
            --task-definition your_task_definition \
            --force-new-deployment

      # Add other deployment steps here if needed, such as deploying to EKS
```
