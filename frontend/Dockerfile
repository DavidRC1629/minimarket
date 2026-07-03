# Build stage for Angular frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --silent
COPY . .
RUN npm run build

# Production stage with nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist/minimarket-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
