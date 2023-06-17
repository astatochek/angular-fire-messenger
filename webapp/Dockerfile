# Stage 1: Build Angular application
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --force
COPY . .
RUN npm run build

# Stage 2: Serve the built Angular application
FROM nginx
COPY --from=builder /app/dist/messenger-angular-app /usr/share/nginx/html
EXPOSE 80

