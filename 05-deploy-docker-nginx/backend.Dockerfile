FROM node:22-bookworm-slim

WORKDIR /app

# Prisma's query engine needs OpenSSL on the slim Node image.
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# COPY preserves source permissions. Give node ownership even for mode-600 files.
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node prisma ./prisma
RUN npm run prisma:generate

COPY --chown=node:node backend ./backend

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

USER node
CMD ["node", "backend/server.js"]
