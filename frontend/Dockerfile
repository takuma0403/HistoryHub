FROM node:20 AS builder

WORKDIR /app
COPY frontend/package.json ./
COPY frontend/package-lock.json ./ 
RUN npm install

COPY frontend ./
RUN npm run build
