FROM node:22-alpine AS base

# Install openssl for Prisma
RUN apk update && apk add --no-cache openssl

WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Runner stage
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
# Copy public folder if it exists (for static assets before build, though React Router v7 puts them in build/client, it's safe to copy)
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]
