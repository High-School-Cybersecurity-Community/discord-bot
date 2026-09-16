FROM ghcr.io/pnpm/pnpm:12 AS build
ARG buildVersion

ENV PUBLIC_BUILD_VERSION=${buildVersion}

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

RUN pnpm runtime set $(pnpm pkg get devEngines.runtime.name) $(pnpm pkg get devEngines.runtime.version)
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM ghcr.io/pnpm/pnpm:12 AS run
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

RUN pnpm runtime set $(pnpm pkg get devEngines.runtime.name) $(pnpm pkg get devEngines.runtime.version)
RUN pnpm install --prod --frozen-lockfile
COPY --from=build dist ./

CMD ["pnpm", "start"]
