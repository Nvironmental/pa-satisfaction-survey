#!/bin/bash

# Script to test the application with npm (same as Digital Ocean)
# This helps ensure compatibility between local Bun and production npm

echo "Testing with npm to match Digital Ocean environment..."

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "Removing existing node_modules..."
    rm -rf node_modules
fi

# Check if package-lock.json exists
if [ -f "package-lock.json" ]; then
    echo "Removing existing package-lock.json..."
    rm package-lock.json
fi

# Install dependencies with npm
echo "Installing dependencies with npm..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build the application
echo "Building application..."
npm run build

# Start the application
echo "Starting application with npm..."
echo "You can now test PDF export functionality"
echo "Press Ctrl+C to stop"
npm start
