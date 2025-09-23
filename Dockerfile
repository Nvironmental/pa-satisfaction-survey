# Based on Daniel Grychtoł's proven approach for Puppeteer on DigitalOcean App Platform
# https://danielgrychtol.com/posts/app-platform-puppeteer
FROM node:18-slim

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY bun.lock ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Install Chrome for Puppeteer
RUN npx puppeteer browsers install chrome

# Install Chrome dependencies (proven to work on DigitalOcean App Platform)
RUN apt-get update && apt-get install -y \
    fonts-noto-color-emoji \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libdrm2 \
    libglib2.0-0 \
    libgtk-3-0 \
    libgbm1 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    xz-utils \
    --no-install-recommends \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /var/lib/apt/lists/*

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
