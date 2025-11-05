#!/bin/bash

# 🚀 Deploy via API (sin necesidad de CLI)
# Este script usa las APIs de Railway y Vercel directamente

set -e

echo "🚀 DEPLOY VÍA API - Super-Son1k-2.1"
echo ""
echo "⚠️  IMPORTANTE: Necesitas tokens de API"
echo ""
echo "Este script requiere:"
echo "1. Railway API Token (https://railway.app/account/tokens)"
echo "2. Vercel API Token (https://vercel.com/account/tokens)"
echo ""
echo "Para obtener los tokens:"
echo "- Railway: https://railway.app/account/tokens"
echo "- Vercel: https://vercel.com/account/tokens"
echo ""

read -p "¿Tienes los tokens? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Necesitas los tokens primero"
    exit 1
fi

read -p "Railway API Token: " RAILWAY_TOKEN
read -p "Vercel API Token: " VERCEL_TOKEN
read -p "Railway Project ID (opcional): " RAILWAY_PROJECT_ID
read -p "Vercel Project ID - Ghost Studio (opcional): " VERCEL_GHOST_ID
read -p "Vercel Project ID - The Generator (opcional): " VERCEL_GENERATOR_ID

echo ""
echo "📦 Deployando..."

# Backend a Railway
if [ -n "$RAILWAY_TOKEN" ] && [ -n "$RAILWAY_PROJECT_ID" ]; then
    echo "🚂 Deployando Backend a Railway..."
    curl -X POST "https://api.railway.app/v1/deployments" \
        -H "Authorization: Bearer $RAILWAY_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"projectId\":\"$RAILWAY_PROJECT_ID\"}" \
        || echo "⚠️  Error en deploy de Railway"
fi

# Ghost Studio a Vercel
if [ -n "$VERCEL_TOKEN" ] && [ -n "$VERCEL_GHOST_ID" ]; then
    echo "🎨 Deployando Ghost Studio a Vercel..."
    curl -X POST "https://api.vercel.com/v13/deployments" \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"projectId\":\"$VERCEL_GHOST_ID\"}" \
        || echo "⚠️  Error en deploy de Ghost Studio"
fi

# The Generator a Vercel
if [ -n "$VERCEL_TOKEN" ] && [ -n "$VERCEL_GENERATOR_ID" ]; then
    echo "🎵 Deployando The Generator a Vercel..."
    curl -X POST "https://api.vercel.com/v13/deployments" \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"projectId\":\"$VERCEL_GENERATOR_ID\"}" \
        || echo "⚠️  Error en deploy de The Generator"
fi

echo ""
echo "✅ Deploy iniciado"
echo "Verifica el estado en los dashboards:"
echo "- Railway: https://railway.app/dashboard"
echo "- Vercel: https://vercel.com/dashboard"

