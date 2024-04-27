FROM node:21-alpine AS build

WORKDIR /app

# Copy the package.json (and package-lock.json) first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Now copy the application source code
COPY avatars ./avatars
COPY js ./js

# Build the application
RUN npm run build

EXPOSE 80

CMD ["tail", "-f", "/dev/null"]