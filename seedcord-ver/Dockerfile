FROM ghcr.io/pnpm/pnpm:12 AS build

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM ghcr.io/pnpm/pnpm:12 AS deps

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --prod

FROM node:26-slim AS run

WORKDIR /app

COPY --from=build /app/dist/ ./dist
COPY --from=deps /app/node_modules/ ./node_modules

HEALTHCHECK --interval=30s --retries=3 --start-interval=5s --start-period=5s --timeout=30s \
    CMD ["node", "--input-type=module", "-e", "const response = await fetch('http://localhost:6967/health'); if (!response.ok) throw new Error(`HTTP ${response.status}`)"]

EXPOSE 6967

CMD ["node", "--enable-source-maps", "dist/index.mjs"]