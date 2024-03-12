# Multi-stage build
# Step 1: From a node image runs npm install to install all the dependencies
FROM node:21 AS build

WORKDIR /app

COPY . ./
RUN npm install

RUN npm init -y

RUN npm install three dat.gui --save

RUN npm install -g parcel-bundler

# The --no-minify flag is used to avoid minification of the code
# otherwise it will not work
RUN parcel build index.html --no-minify --public-url '/pong/'

# Step 2: uses nginx to serve the app
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copies the output of previous step
COPY --from=build /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]