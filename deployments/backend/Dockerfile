FROM node:alpine

WORKDIR /app/api

COPY package*.json .

RUN npm ci

COPY . .

CMD [ "npm", "start"]