# Stage 1: Build React frontend
FROM node:20-alpine

WORKDIR /client

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5173
RUN npm run dev