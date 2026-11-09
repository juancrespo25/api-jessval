# Build context: repository root (shared dependencies live in the root package.json)
# docker build -f apps/ms-facturacion/Dockerfile .
FROM node:22.18-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies first to leverage build cache
COPY package.json ./
COPY apps/ms-facturacion/package.json ./apps/ms-facturacion/
RUN npm install --workspace=ms-facturacion --include-workspace-root

# Copy source and compile TypeScript
COPY apps/ms-facturacion/tsconfig.json ./apps/ms-facturacion/
COPY apps/ms-facturacion/src ./apps/ms-facturacion/src
RUN npm run build --workspace=ms-facturacion

# Runtime stage
FROM node:22.18-alpine AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/apps/ms-facturacion/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/ms-facturacion/dist ./dist

EXPOSE 4008

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
