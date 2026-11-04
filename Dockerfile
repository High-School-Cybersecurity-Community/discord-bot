FROM ghcr.io/pnpm/pnpm:12 AS build
ARG buildVersion
ENV PUBLIC_BUILD_VERSION=${buildVersion}
WORKDIR /source

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

RUN pnpm runtime set $(pnpm pkg get devEngines.runtime.name) $(pnpm pkg get devEngines.runtime.version)
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:26-slim AS run
WORKDIR /app

COPY --from=build /source/dist ./

CMD ["node", "--env-file-if-exists=.env", "index.mjs"]
