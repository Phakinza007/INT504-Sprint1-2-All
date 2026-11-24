FROM node:22-bookworm-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY frontend ./frontend
RUN npm run build:css
RUN npm run build:js

FROM nginx:stable-alpine
# Nginx workers must be able to read public assets regardless of host umask.
COPY --chmod=644 frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chmod=644 /app/frontend/index.html /usr/share/nginx/html/index.html
COPY --from=build --chmod=644 /app/frontend/app.js /usr/share/nginx/html/app.js
COPY --from=build --chmod=644 /app/frontend/my-schedule.html /usr/share/nginx/html/my-schedule.html
COPY --from=build --chmod=644 /app/frontend/my-schedule.js /usr/share/nginx/html/my-schedule.js
COPY --from=build --chmod=644 /app/frontend/output.css /usr/share/nginx/html/output.css
COPY --from=build /app/frontend/scripts /usr/share/nginx/html/scripts
RUN chmod -R a+rX /usr/share/nginx/html
EXPOSE 80
