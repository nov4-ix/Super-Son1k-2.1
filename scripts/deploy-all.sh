#!/bin/bash

# 🚀 Script de Deploy Completo
# Uso: ./scripts/deploy-all.sh
# Requiere: Railway CLI y Vercel CLI instalados y autenticados

set -e

echo "🚀 DEPLOY COMPLETO - Super-Son1k-2.1"
echo ""

# Verificar herramientas
echo "🔍 Verificando herramientas..."
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no encontrado"
    echo "Instala con: npm install -g @railway/cli"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no encontrado"
    echo "Instala con: npm install -g vercel"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado"
    echo "Instala Node.js primero"
    exit 1
fi

echo "✅ Todas las herramientas disponibles"
echo ""

# Verificar autenticación
echo "🔐 Verificando autenticación..."
if ! railway whoami &> /dev/null; then
    echo "⚠️  No estás autenticado en Railway"
    echo "Ejecuta: railway login"
    exit 1
fi

if ! vercel whoami &> /dev/null; then
    echo "⚠️  No estás autenticado en Vercel"
    echo "Ejecuta: vercel login"
    exit 1
fi

echo "✅ Autenticación verificada"
echo ""

# Deploy Backend a Railway
echo "📦 DEPLOY 1/3: Backend a Railway"
echo "================================"
cd packages/backend

# Generar Prisma Client
echo "Generando Prisma Client..."
npx prisma generate

# Build
echo "Compilando TypeScript..."
npm run build

# Deploy a Railway
echo "Deployando a Railway..."
railway up

echo ""
echo "⚠️  IMPORTANTE: Después del deploy, ejecuta migraciones:"
echo "   railway run npx prisma db push"
echo ""

# Deploy Ghost Studio a Vercel
echo ""
echo "📦 DEPLOY 2/3: Ghost Studio a Vercel"
echo "===================================="
cd ../../apps/ghost-studio

echo "Deployando a Vercel..."
vercel --prod

echo ""
echo "⚠️  IMPORTANTE: Configura variables de entorno en Vercel Dashboard:"
echo "   VITE_BACKEND_URL=https://tu-backend.railway.app"
echo ""

# Deploy The Generator a Vercel
echo ""
echo "📦 DEPLOY 3/3: The Generator a Vercel"
echo "======================================"
cd ../the-generator-nextjs

echo "Deployando a Vercel..."
vercel --prod

echo ""
echo "✅ DEPLOY COMPLETADO"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura variables de entorno en Railway Dashboard"
echo "2. Ejecuta migraciones: railway run npx prisma db push"
echo "3. Configura variables de entorno en Vercel para Ghost Studio"
echo "4. Configura variables de entorno en Vercel para The Generator"
echo "5. Verifica health check: curl https://tu-backend.railway.app/health"

