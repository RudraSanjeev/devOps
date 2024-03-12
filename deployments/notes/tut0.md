#### Node-express app contianer:

##### Dockerfile:

```Dockerfile
FROM node:latest
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

#### MongoDB: - create and get mongosh and run some db cmd

- access the mongosh

```bash
mongosh --port 2717

```

#### nginx:

- pull from official
- run like that

```bash
docker run -p 80:80 nginx
```

- now rm container
- create html files
- again run this cmd to serve html files

```bash
docker run -d -p 8000:80 -v ~/nginx-html:/usr/share/nginx/html --name my-nginx nginx

```

#### Node.js and mongodb for restapi app container:

##### node.js

- pull the base image from the docker hub
- create a **Dockerfile** in the root file {\*\*Dockerfile - blue print of our contianer}
- add the following script

```Dockerfile
FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .


# CMD ["npm", "start"]
CMD ["npm", "run", "dev"] #add nodemon index.js to dev in package.json


```

- create **.dockerignore** file and add the following

```.dockerignore
node_modules
Dockerfile
.dockerignore
dockercompose.yml


```

- docker build . # simply build the image but we want first the mongodb with in same network

- create **docker-compose.yml** file and add following script

```yml
version: "3.9"

services:
  mongo_db:
    container_name: db_container
    image: mongo:latest
    restart: always
    ports:
      - 2717: 27017
    volumes:
      - mongo_db:/data/db

  # nodejs api service
  api:
    container_name: api_container
    build: .
    ports:
      - 8000:8000
    environment:
      PORT: 8000
      MONGODB_URI: mongodb://mongo_db/27017
    depends_on:
      - mongo_db

volumes:
  mongo_db: {}
```

- now run the docker compose up cmd

#### How to scale nodejs app using nginx as reverse-proxy:

- first remove container_name from the api service to have unique conatainer name of each conatainer
- we also have to remove ports binding because one port can bind to one container locally at a time
- now to multiple port we use nginx **reverse proxy**.

- modify or create new api service like this

```yml
version: "3.9"

service:
  mongo_db:
    container_name: db_container
    image: mongo:latest
    restart: always
    ports:
      - 2717: 27017
    volumes:
      - mongo_db:/data/db

  # nodejs api service
  api:
    build: .

  nginx:
    image: iginx:latest
    volumes:
      - ./conf.d:/etc/nginx/conf.d
    depends_on:
      - api
    ports:
      - 8000:8000
```

- create my_conf.conf inside conf.d folder in the root dir

```conf
server {
    listen: 3000;
    location: / {
        proxy_pass: http://api:3000; ;set proxy in round-robin way
    }
}
```

```bash
docker compse up --scale api=2
```

- you can test it using
  curl localhost:3000
