#!/bin/bash

# 🔧 Script para instalar herramientas de deploy
# Uso: ./scripts/install-deploy-tools.sh

set -e

echo "🚀 Instalando herramientas de deploy..."

# Verificar Homebrew
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew no está instalado"
    echo "Instala Homebrew primero: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

echo "✅ Homebrew encontrado"

# Instalar Node.js
echo ""
echo "📦 Instalando Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js ya está instalado: $(node --version)"
else
    brew install node
    echo "✅ Node.js instalado"
fi

# Instalar Railway CLI
echo ""
echo "📦 Instalando Railway CLI..."
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI ya está instalado: $(railway --version)"
else
    npm install -g @railway/cli
    echo "✅ Railway CLI instalado"
fi

# Instalar Vercel CLI
echo ""
echo "📦 Instalando Vercel CLI..."
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI ya está instalado: $(vercel --version)"
else
    npm install -g vercel
    echo "✅ Vercel CLI instalado"
fi

echo ""
echo "✅ Todas las herramientas instaladas"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ejecuta: railway login"
echo "2. Ejecuta: vercel login"
echo "3. Luego puedes ejecutar los scripts de deploy"

