# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Set environment variables for build
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration (optional - will use default if not provided)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]