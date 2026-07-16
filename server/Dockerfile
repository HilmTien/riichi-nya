FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
COPY server/package.json ./server/
COPY client/package.json ./client/

RUN bun install --frozen-lockfile

COPY server ./server
COPY client ./client

WORKDIR /app/server

EXPOSE 8000
CMD ["bun", "run", "/app/server/src/index.ts"]