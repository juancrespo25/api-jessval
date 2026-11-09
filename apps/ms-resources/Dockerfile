# Build context: repository root (shared dependencies live in the root package.json)
# docker build -f apps/ms-resources/Dockerfile .
FROM node:22.18-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies first to leverage build cache
COPY package.json ./
COPY apps/ms-resources/package.json ./apps/ms-resources/
RUN npm install --workspace=ms-resources --include-workspace-root

# Copy source and compile TypeScript
COPY apps/ms-resources/tsconfig.json ./apps/ms-resources/
COPY apps/ms-resources/src ./apps/ms-resources/src
RUN npm run build --workspace=ms-resources

# Runtime stage
FROM node:22.18-alpine AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/apps/ms-resources/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/ms-resources/dist ./dist

EXPOSE 4003

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
