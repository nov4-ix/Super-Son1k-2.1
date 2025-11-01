#!/bin/bash

# Script para obtener URL de deployment en Vercel

echo "🔍 Obteniendo información de Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado"
    echo "📦 Instálalo con: npm i -g vercel"
    echo ""
    echo "O ve manualmente a: https://vercel.com/dashboard"
    exit 1
fi

echo "📋 Listando proyectos en Vercel..."
echo ""

# List projects
vercel ls 2>/dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Para obtener URL de un proyecto específico:"
echo ""
echo "1. Ve a: https://vercel.com/dashboard"
echo "2. Busca tu proyecto: 'the-generator' o 'the-generator-nextjs'"
echo "3. Click en el proyecto"
echo "4. En 'Overview', copia la URL (ej: https://the-generator-xxx.vercel.app)"
echo ""
echo "O usa:"
echo "  cd apps/the-generator-nextjs"
echo "  vercel inspect"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

