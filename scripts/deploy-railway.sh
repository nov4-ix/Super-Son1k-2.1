#!/bin/bash

# 🚀 Script de Deploy para Railway Backend
# Uso: ./scripts/deploy-railway.sh

set -e

echo "🚀 Iniciando deploy a Railway..."

# Verificar que Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no está instalado"
    echo "Instala con: npm i -g @railway/cli"
    exit 1
fi

# Verificar que estamos en el directorio correcto
if [ ! -f "railway.toml" ]; then
    echo "❌ railway.toml no encontrado. Asegúrate de estar en la raíz del proyecto."
    exit 1
fi

echo "📦 Generando Prisma Client..."
cd packages/backend
npm install
npx prisma generate

echo "🏗️  Compilando TypeScript..."
npm run build

echo "✅ Build completado"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ejecuta: railway login"
echo "2. Ejecuta: railway link"
echo "3. Ejecuta: railway up"
echo "4. Configura variables de entorno en Railway Dashboard"
echo "5. Ejecuta migraciones: railway run npx prisma db push"
echo ""
echo "🔍 Para verificar:"
echo "- Health check: https://your-backend.railway.app/health"
echo "- Logs: railway logs"

