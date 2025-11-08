#!/bin/bash

# 🚀 Script para configurar variables de entorno en Vercel desde CLI
# Requiere: Vercel CLI instalado y autenticado
# Uso: ./scripts/configurar-variables-vercel.sh [ghost-studio|the-generator]

set -e

APP=$1

if [ -z "$APP" ]; then
    echo "❌ Especifica la app: ghost-studio o the-generator"
    echo "Uso: ./scripts/configurar-variables-vercel.sh ghost-studio"
    exit 1
fi

if [ "$APP" != "ghost-studio" ] && [ "$APP" != "the-generator" ]; then
    echo "❌ App inválida. Debe ser: ghost-studio o the-generator"
    exit 1
fi

echo "🎨 Configurando variables en Vercel ($APP)"
echo ""

# Verificar Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no encontrado"
    echo "Instala con: npm install -g vercel"
    echo "Luego autentica: vercel login"
    exit 1
fi

# Verificar autenticación
if ! vercel whoami &> /dev/null; then
    echo "⚠️  No estás autenticado en Vercel"
    echo "Ejecuta: vercel login"
    exit 1
fi

echo "✅ Vercel CLI disponible"
echo ""

# Determinar archivo según la app
if [ "$APP" == "ghost-studio" ]; then
    ENV_FILE="env.ghost-studio.REAL"
    PROJECT_PATH="apps/ghost-studio"
elif [ "$APP" == "the-generator" ]; then
    ENV_FILE="env.the-generator.REAL"
    PROJECT_PATH="apps/the-generator-nextjs"
fi

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Archivo $ENV_FILE no encontrado"
    exit 1
fi

echo "📋 Leyendo variables de $ENV_FILE..."
echo ""

# Cambiar al directorio del proyecto
cd "$PROJECT_PATH" || exit 1

# Leer variables del archivo
while IFS='=' read -r key value || [ -n "$key" ]; do
    # Ignorar comentarios y líneas vacías
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue
    
    # Extraer key y value
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    # Ignorar si no hay key
    [[ -z "$key" ]] && continue
    
    # Si value está vacío, saltar
    if [[ -z "$value" ]]; then
        continue
    fi
    
    # Ignorar variables que tienen REEMPLAZA o TU_BACKEND en el valor
    if [[ "$value" == *"REEMPLAZA"* ]] || [[ "$value" == *"TU_BACKEND"* ]]; then
        echo "⏭️  Saltando $key (requiere valor real)"
        continue
    fi
    
    echo "🔧 Configurando: $key"
    vercel env add "$key" production <<< "$value" 2>&1 | grep -v "already exists" || true
done < "../../$ENV_FILE"

cd ../..

echo ""
echo "✅ Variables configuradas en Vercel para $APP"
echo ""
echo "📋 Próximos pasos:"
echo "1. Agrega VITE_BACKEND_URL o NEXT_PUBLIC_BACKEND_URL con la URL de Railway"
echo "2. Verifica en Vercel Dashboard que todas las variables están configuradas"
echo "3. Deploy el proyecto"

