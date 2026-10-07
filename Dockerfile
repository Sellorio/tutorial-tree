FROM oven/bun:1.4.2 AS dependencies
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM dependencies AS development
COPY . .
ENV APP_DATA_DIR=/data
EXPOSE 5173
CMD ["bun", "--bun", "run", "vite", "--host", "0.0.0.0", "--port", "5173"]

FROM dependencies AS build
COPY . .
RUN bun run build

FROM oven/bun:1.4.2 AS production
WORKDIR /app
ENV NODE_ENV=production
ENV APP_DATA_DIR=/data
ENV PORT=3000
COPY package.json bun.lock server.ts ./
RUN bun install --production --frozen-lockfile
COPY --from=build /app/dist ./dist
VOLUME ["/data"]
EXPOSE 3000
CMD ["bun", "run", "start"]