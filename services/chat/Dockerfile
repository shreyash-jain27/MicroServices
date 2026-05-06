FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY services/chat/package*.json ./services/chat/
COPY packages/common/package*.json ./packages/common/

RUN npm install --workspace=@service-hub/chat
RUN npm install --workspace=@service-hub/common

COPY services/chat ./services/chat
COPY packages/common ./packages/common

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/chat ./services/chat
COPY --from=builder /app/packages/common ./packages/common

WORKDIR /app/services/chat

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3002/chat/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "src/server.js"]
