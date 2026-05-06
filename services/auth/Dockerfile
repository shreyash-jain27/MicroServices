# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY services/auth/package*.json ./services/auth/
COPY packages/common/package*.json ./packages/common/

# Install dependencies
RUN npm install --workspace=@service-hub/auth
RUN npm install --workspace=@service-hub/common

# Copy source code
COPY services/auth ./services/auth
COPY packages/common ./packages/common

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/auth ./services/auth
COPY --from=builder /app/packages/common ./packages/common

# Set working directory to auth service
WORKDIR /app/services/auth

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3001/auth/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start service
CMD ["node", "src/server.js"]
