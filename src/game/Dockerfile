FROM node:21-alpine AS build

WORKDIR /app

RUN mkdir -p ./avatars ./js

COPY js ./js

# Build the application
RUN npm run build

EXPOSE 80

CMD ["tail", "-f", "/dev/null"]