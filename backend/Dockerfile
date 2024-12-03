# Stage 1: Build React frontend
FROM node:20-alpine

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000
RUN npm run start