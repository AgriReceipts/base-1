# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app



ENV VITE_API_BASE_URL=https://www.agri-receipts.in/api


COPY package*.json ./
RUN npm install
COPY . .
# The VITE_API_BASE_URL is passed in from docker-compose.yml
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:stable-alpine AS runner
# Copy the built files from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose the port Nginx will run on
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]