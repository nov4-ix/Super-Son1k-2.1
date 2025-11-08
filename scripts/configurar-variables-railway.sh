#!/bin/bash

# 🚀 Script para configurar variables de entorno en Railway desde CLI
# Requiere: Railway CLI instalado y autenticado

set -e

echo "🚂 Configurando variables en Railway (Backend)"
echo ""

# Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no encontrado"
    echo "Instala con: npm install -g @railway/cli"
    echo "Luego autentica: railway login"
    exit 1
fi

# Verificar autenticación
if ! railway whoami &> /dev/null; then
    echo "⚠️  No estás autenticado en Railway"
    echo "Ejecuta: railway login"
    exit 1
fi

echo "✅ Railway CLI disponible"
echo ""

# Leer variables del archivo env.backend.REAL
ENV_FILE="env.backend.REAL"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Archivo $ENV_FILE no encontrado"
    exit 1
fi

echo "📋 Leyendo variables de $ENV_FILE..."
echo ""

# Variables del archivo (sin comentarios y líneas vacías)
while IFS='=' read -r key value || [ -n "$key" ]; do
    # Ignorar comentarios y líneas vacías
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue
    
    # Extraer key y value
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    # Ignorar si no hay key
    [[ -z "$key" ]] && continue
    
    # Si value está vacío, usar valor por defecto o saltar
    if [[ -z "$value" ]]; then
        continue
    fi
    
    # Ignorar variables que Railway crea automáticamente
    if [[ "$key" == "DATABASE_URL" ]] || [[ "$key" == "REDIS_URL" ]] || [[ "$key" == "JWT_SECRET" ]]; then
        echo "⏭️  Saltando $key (Railway lo crea automáticamente)"
        continue
    fi
    
    # Ignorar variables que tienen REEMPLAZA en el valor
    if [[ "$value" == *"REEMPLAZA"* ]]; then
        echo "⏭️  Saltando $key (requiere valor real)"
        continue
    fi
    
    echo "🔧 Configurando: $key"
    railway variables set "$key=$value" 2>&1 | grep -v "already exists" || true
done < "$ENV_FILE"

echo ""
echo "✅ Variables configuradas en Railway"
echo ""
echo "📋 Próximos pasos:"
echo "1. Verifica en Railway Dashboard que todas las variables están configuradas"
echo "2. Agrega PostgreSQL y Redis (Railway Dashboard → New → Database)"
echo "3. Deploy el proyecto"

