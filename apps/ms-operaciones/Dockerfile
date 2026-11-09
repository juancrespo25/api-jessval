# Build context: repository root (shared dependencies live in the root package.json)
# docker build -f apps/ms-operaciones/Dockerfile .
FROM node:22.18-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies first to leverage build cache
COPY package.json ./
COPY apps/ms-operaciones/package.json ./apps/ms-operaciones/
RUN npm install --workspace=ms-operaciones --include-workspace-root

# Copy source and compile TypeScript
COPY apps/ms-operaciones/tsconfig.json ./apps/ms-operaciones/
COPY apps/ms-operaciones/src ./apps/ms-operaciones/src
RUN npm run build --workspace=ms-operaciones

# Runtime stage
FROM node:22.18-alpine AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/apps/ms-operaciones/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/ms-operaciones/dist ./dist

EXPOSE 4006

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
