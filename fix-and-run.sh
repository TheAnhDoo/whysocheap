#!/bin/bash

# WhySoCheap Quick Fix Script
# This script fixes common issues and starts the development server

echo "🔧 WhySoCheap Quick Fix Script"
echo "============================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the idol-tshirt-store directory"
    exit 1
fi

echo "✅ Found package.json"

# Clean and reinstall dependencies
echo "🧹 Cleaning dependencies..."
rm -rf node_modules package-lock.json

echo "📦 Installing dependencies..."
npm cache clean --force
npm install --no-optional

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    echo "💡 Try running: npm install --legacy-peer-deps"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the project
echo "🏗️ Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Start development server
echo "🚀 Starting development server..."
echo "Your WhySoCheap website will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"

npm run dev
