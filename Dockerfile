FROM node:20-alpine AS builder
WORKDIR /squid
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json .
COPY schema.graphql .
COPY src src
COPY db db
RUN npm run build

FROM node:20-alpine AS deps
WORKDIR /squid
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

FROM node:20-alpine
WORKDIR /squid
COPY --from=deps /squid/node_modules node_modules
COPY --from=deps /squid/package.json .
COPY --from=builder /squid/lib lib
COPY --from=builder /squid/db db
COPY --from=builder /squid/schema.graphql .
COPY commands.json .
RUN echo -e "loglevel=silent\nupdate-notifier=false" > .npmrc
RUN npm i -g @subsquid/commands && mv $(which squid-commands) /usr/local/bin/sqd
ENV PROCESSOR_PROMETHEUS_PORT=3000
