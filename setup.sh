#!/bin/bash

# Super-Son1k-2.0 Setup Script
# This script helps set up the development environment

echo "🎵 Setting up Super-Son1k-2.0..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment files
echo "🔧 Setting up environment files..."

# Backend .env
if [ ! -f "packages/backend/.env" ]; then
    echo "Creating backend .env file..."
    cp env.example packages/backend/.env
    echo "⚠️  Please edit packages/backend/.env with your configuration"
fi

# Frontend .env.local
if [ ! -f "apps/web-classic/.env.local" ]; then
    echo "Creating frontend .env.local file..."
    cat > apps/web-classic/.env.local << EOF
# Frontend Environment Variables
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
VITE_API_URL="http://localhost:3001"
VITE_WS_URL="ws://localhost:3001"
VITE_APP_NAME="Super-Son1k-2.0"
VITE_APP_VERSION="2.0.0"
VITE_APP_URL="http://localhost:3000"
VITE_DEBUG="true"
EOF
    echo "⚠️  Please edit apps/web-classic/.env.local with your configuration"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
cd packages/backend
npx prisma generate
cd ../..

# Build shared packages
echo "🔨 Building shared packages..."
npm run build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit packages/backend/.env with your database and API keys"
echo "2. Edit apps/web-classic/.env.local with your Supabase configuration"
echo "3. Run 'npm run db:push' to set up the database"
echo "4. Run 'npm run dev' to start the development servers"
echo ""
echo "📚 Documentation: https://docs.super-son1k.com"
echo "🐛 Issues: https://github.com/super-son1k/super-son1k-2.0/issues"
echo ""
echo "Happy coding! 🚀"