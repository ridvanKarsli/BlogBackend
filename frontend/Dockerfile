# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Keep client bundle origin-relative so calls go through nginx (/api, /uploads, /media).
ENV NEXT_PUBLIC_API_BASE ""

# Build Next.js application
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV production
# Server Components reach the backend over the Docker network.
# The browser uses same-origin relative URLs proxied by nginx (NEXT_PUBLIC_API_BASE stays empty).
ENV INTERNAL_API_BASE http://backend:8080

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose port for Next.js
EXPOSE 3000

# Start Next.js server
CMD ["npm", "start"]
