#### Dockerfile in detail:

```Dockerfile
# setting base image i.e. node
FROM node:19-alpine
# copu package.json and src to image folder anme /app/
COPY package.json /app/
COPY src /app/

# setting working dir to /app
WORKDIR /app

# to run cmd
RUN npm install

CMD ["node", "index.js"]
```

#### Create an image:

```bash
docker build -t project0:1.0.0 .


```
