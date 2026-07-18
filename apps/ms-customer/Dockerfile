# Build stage
FROM node:22.18-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies first to leverage build cache
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and compile TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Runtime stage
FROM node:22.18-alpine AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4002

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
