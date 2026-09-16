FROM node:26 AS build
USER node
ARG buildVersion

ENV PUBLIC_BUILD_VERSION=${buildVersion}

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:26 AS run
WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile
COPY --from=build dist ./

CMD ["node", "dist/index.js"]
