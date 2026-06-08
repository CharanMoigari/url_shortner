# Backend Dockerfile

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build TypeScript
RUN npm run build

# Remove devDependencies for production
RUN npm prune --omit=dev

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
