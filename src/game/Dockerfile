FROM node:21 AS build

WORKDIR /app

RUN mkdir -p ./avatars ./js

COPY avatars ./avatars
COPY js ./js
COPY package.json .

RUN npm install
RUN npm run build

EXPOSE 80

CMD ["tail", "-f", "/dev/null"]