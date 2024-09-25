# Use Bun image from the Docker Hub
FROM oven/bun:debian

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy app files
COPY . .

# Install dependencies
RUN bun install

COPY prisma ./prisma/

# Copy app files
COPY . .

# Generate Prisma
RUN bun run db:gen

# Run the application
CMD ["bun", "start:migrate:production"]