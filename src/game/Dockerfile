# Multi-stage build
# Step 1: From a node image runs npm install to install all the dependencies
FROM node:21 AS build

WORKDIR /app

RUN mkdir -p ./avatars ./js

COPY avatars ./avatars
COPY js ./js
COPY index.html .
COPY index2.html .
COPY package.json .

RUN npm install
RUN npm run build

# Step 2: uses nginx to serve the app
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copies the output of previous step
COPY --from=build /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]