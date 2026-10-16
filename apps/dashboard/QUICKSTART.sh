#!/bin/bash

# Civet Dashboard Quick Start Script
# This script helps you get the dashboard running quickly

set -e

echo "🚀 Civet Dashboard Quick Start"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found"
  echo "Please run this script from /Users/ryanamarit/civet/apps/dashboard"
  exit 1
fi

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
  echo "❌ Error: pnpm is not installed"
  echo "Please install pnpm: npm install -g pnpm"
  exit 1
fi

echo "✅ pnpm found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo ""
  echo "📝 Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "⚠️  Please edit .env.local with your configuration"
  echo ""
  echo "Required environment variables:"
  echo "  - NEXTAUTH_URL=http://localhost:3000"
  echo "  - NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>"
  echo "  - DATABASE_URL=<your database connection string>"
  echo "  - NEXT_PUBLIC_API_URL=<your API URL>"
  echo ""
  read -p "Press Enter after updating .env.local to continue..."
else
  echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Make sure your environment variables are configured in .env.local"
echo "  2. Start the development server: pnpm dev"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "  - README.md - Overview and features"
echo "  - SETUP.md - Detailed setup guide"
echo "  - DASHBOARD_OVERVIEW.md - Technical details"
echo "  - BUILD_SUMMARY.md - Complete build summary"
echo ""
echo "Happy coding! 🎨"
