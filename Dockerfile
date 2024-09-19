# Stage 1: Install dependencies and build the app
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --production

# Copy all the app files and build the app
COPY . .
RUN npm run build

# Stage 2: Serve the app using a lightweight server
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built files from the previous stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Install only production dependencies
RUN npm install --production

# Expose the port Next.js will run on
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "run", "start"]
