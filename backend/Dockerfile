# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install python and make for node-gyp if native addons are used
RUN apk add --no-cache python3 make g++ 

# Copy package config and install all dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the project (skip lint - not needed in build environment)
RUN npx tsc --project tsconfig.prod.json && npm run build:copy-static && npm run build:make-db



# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package config and install ONLY production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built app from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Generate Prisma Client and move it to where the compiled code expects it (dist/generated/client)
RUN npx prisma generate && mkdir -p dist/generated && mv src/generated/client dist/generated/client

EXPOSE 8081

# Run migrations then start the server
CMD ["./start.sh"]
