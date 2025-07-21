# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package*.json ./
# Install all dependencies including dev for the build step
RUN npm install

# ---- Build ----
FROM deps AS builder
COPY . .
# Generate Prisma Client
RUN npx prisma generate
# Build TypeScript to JavaScript
RUN npm run build

# ---- Production ----
FROM base AS runner
COPY package*.json ./
# Install only production dependencies
RUN npm install --only=production

# Copy built code and Prisma files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma



EXPOSE 3000

# The CMD is now just the command to run the node server
CMD ["node", "dist/server.js"]