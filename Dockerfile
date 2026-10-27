# Stage 1: Build the Vite application
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Google Cloud Run default port is 8080
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
