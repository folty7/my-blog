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

# Build the project
RUN npm run build



# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package config and install ONLY production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built app and configuration from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/prisma ./prisma

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Generate Prisma Client again for the smaller production node_modules
RUN npx prisma generate

EXPOSE 8081

# Run migrations then start the server
CMD ["./start.sh"]
