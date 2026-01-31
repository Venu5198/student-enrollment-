# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---------- Production stage ----------
FROM nginxinc/nginx-unprivileged:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our static files
COPY --from=build /app/dist /usr/share/nginx/html

# Minimal nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
