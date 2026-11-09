# Build context: repository root (shared dependencies live in the root package.json)
# docker build -f apps/ms-reportes/Dockerfile .
FROM node:22.18-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies first to leverage build cache
COPY package.json ./
COPY apps/ms-reportes/package.json ./apps/ms-reportes/
RUN npm install --workspace=ms-reportes --include-workspace-root

# Copy source and compile TypeScript
COPY apps/ms-reportes/tsconfig.json ./apps/ms-reportes/
COPY apps/ms-reportes/src ./apps/ms-reportes/src
RUN npm run build --workspace=ms-reportes

# Runtime stage
FROM node:22.18-alpine AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/apps/ms-reportes/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/ms-reportes/dist ./dist

EXPOSE 4007

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
