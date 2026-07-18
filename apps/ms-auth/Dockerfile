# Multi-stage build for ms-auth
FROM node:22.18-alpine AS builder

# Set working directory
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

# Expose port 4001
EXPOSE 4001

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]