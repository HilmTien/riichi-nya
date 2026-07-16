FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
COPY server/package.json ./server/
COPY client/package.json ./client/

RUN bun install --frozen-lockfile

COPY server ./server
COPY client ./client

WORKDIR /app/client
RUN bun run build

EXPOSE 3000
ENV NODE_ENV=production
CMD ["bun", "run", "/app/client/serve.ts"]