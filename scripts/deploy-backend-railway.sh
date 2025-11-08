#!/bin/bash

# 🚀 Script para deployar Backend a Railway - Paso a Paso
# Ejecuta este script desde la raíz del proyecto

set -e

echo "🚂 =========================================="
echo "🚂 DEPLOY BACKEND A RAILWAY"
echo "🚂 =========================================="
echo ""

# Cargar nvm si existe
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no encontrado"
    echo "Instala con: npm install -g @railway/cli"
    exit 1
fi

echo "✅ Railway CLI disponible"
echo ""

# Paso 1: Linkear proyecto
echo "📌 PASO 1: Linkear proyecto Railway"
echo "Selecciona tu proyecto existente o crea uno nuevo"
railway link

echo ""
echo "✅ Proyecto linkeado"
echo ""

# Paso 2: Verificar servicios
echo "📌 PASO 2: Verificar servicios PostgreSQL y Redis"
echo "En Railway Dashboard, verifica que tengas:"
echo "  - PostgreSQL (crea DATABASE_URL automáticamente)"
echo "  - Redis (crea REDIS_URL automáticamente)"
echo ""
read -p "¿Tienes PostgreSQL y Redis conectados? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⚠️  Ve a Railway Dashboard → New → Database → Agrega PostgreSQL y Redis"
    exit 1
fi

echo "✅ Servicios verificados"
echo ""

# Paso 3: Configurar variables
echo "📌 PASO 3: Configurar variables de entorno"
echo "Leyendo variables de env.backend.REAL..."
echo ""

ENV_FILE="env.backend.REAL"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Archivo $ENV_FILE no encontrado"
    exit 1
fi

# Variables a configurar (ignorando las que Railway crea automáticamente)
while IFS='=' read -r key value || [ -n "$key" ]; do
    # Ignorar comentarios y líneas vacías
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue
    
    # Extraer key y value
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    # Ignorar si no hay key
    [[ -z "$key" ]] && continue
    
    # Ignorar variables que Railway crea automáticamente
    if [[ "$key" == "DATABASE_URL" ]] || [[ "$key" == "REDIS_URL" ]] || [[ "$key" == "JWT_SECRET" ]]; then
        continue
    fi
    
    # Ignorar variables que tienen REEMPLAZA en el valor
    if [[ "$value" == *"REEMPLAZA"* ]] || [[ "$value" == *"TU_BACKEND"* ]]; then
        echo "⏭️  Saltando $key (requiere valor real)"
        continue
    fi
    
    # Ignorar si value está vacío
    if [[ -z "$value" ]]; then
        continue
    fi
    
    echo "🔧 Configurando: $key"
    railway variables --set "$key=$value" 2>&1 | grep -v "already exists" || true
done < "$ENV_FILE"

echo ""
echo "✅ Variables configuradas"
echo ""

# Paso 4: Deploy
echo "📌 PASO 4: Deploy del backend"
echo "Iniciando deploy..."
railway up

echo ""
echo "✅ Deploy iniciado"
echo ""
echo "📋 PRÓXIMOS PASOS MANUALES:"
echo ""
echo "1. Ve a Railway Dashboard → Tu servicio backend"
echo "2. Espera a que el deploy termine"
echo "3. Abre el Shell del servicio"
echo "4. Ejecuta:"
echo "   cd packages/backend"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo ""
echo "5. Ve a Settings → Domains y copia la URL del backend"
echo "6. Verifica el health check: https://TU_URL.railway.app/health"
echo ""
echo "✅ Una vez que el backend esté funcionando, continúa con Ghost Studio"
echo ""

