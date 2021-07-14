FROM node:16 as builder

WORKDIR /app
COPY . .

# replace Keycloak endpoints
RUN sed -i "s/adminv2//g" snowpack.config.js

# install dependencies and build application
RUN npm ci
RUN npm run build

FROM nginx:stable

COPY --from=builder /app/build /usr/share/nginx/html

# setup reverse proxy for Keycloak endpoint
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
