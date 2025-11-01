#!/bin/bash

# Quick install Node.js/npm with Homebrew

echo "🍺 Instalando Node.js con Homebrew..."
brew install node

echo ""
echo "✅ Node.js instalado!"
echo ""
echo "Verificar instalación:"
node --version
npm --version

echo ""
echo "📦 Ahora puedes ejecutar:"
echo "   cd apps/the-generator-nextjs"
echo "   npm install"
echo "   vercel --prod"

