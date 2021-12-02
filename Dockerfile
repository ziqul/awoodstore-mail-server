FROM node:17.2.0-bullseye 

WORKDIR /app/

COPY ./ ./

RUN npm ci

CMD node index.js
