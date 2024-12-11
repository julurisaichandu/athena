# Stage 1: Build React frontend
FROM node:20-alpine

WORKDIR /docker_client

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]