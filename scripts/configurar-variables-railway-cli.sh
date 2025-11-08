#!/bin/bash

# 🚀 Script para configurar variables de entorno en Railway desde CLI
# Usa la sintaxis correcta: railway variables --set "KEY=value"

set -e

echo "🚂 Configurando variables en Railway (Backend) desde CLI"
echo ""

# Cargar nvm si existe
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20 2>/dev/null || true

# Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no encontrado"
    echo "Instala con: npm install -g @railway/cli"
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

# Verificar que el proyecto esté linkeado
if ! railway status &> /dev/null; then
    echo "⚠️  Proyecto no linkeado"
    echo "Ejecuta: railway link"
    exit 1
fi

echo "✅ Proyecto linkeado"
echo ""

# Leer variables del archivo env.backend.REAL
ENV_FILE="env.backend.REAL"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Archivo $ENV_FILE no encontrado"
    exit 1
fi

echo "📋 Leyendo variables de $ENV_FILE..."
echo ""

# Variables a configurar
VARIABLES_TO_SET=()

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
        echo "⏭️  Saltando $key (Railway lo crea automáticamente)"
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
    
    VARIABLES_TO_SET+=("$key=$value")
done < "$ENV_FILE"

# Configurar todas las variables de una vez
if [ ${#VARIABLES_TO_SET[@]} -eq 0 ]; then
    echo "⚠️  No hay variables para configurar"
    exit 0
fi

echo "🔧 Configurando ${#VARIABLES_TO_SET[@]} variables..."
echo ""

# Construir comando con todos los --set
SET_ARGS=()
for var in "${VARIABLES_TO_SET[@]}"; do
    key=$(echo "$var" | cut -d'=' -f1)
    echo "  ✓ $key"
    SET_ARGS+=("--set" "$var")
done

echo ""
echo "🚀 Ejecutando comando Railway..."
railway variables "${SET_ARGS[@]}" 2>&1 || {
    echo ""
    echo "⚠️  Algunas variables pueden haber fallado. Verifica en Railway Dashboard"
}

echo ""
echo "✅ Variables configuradas"
echo ""
echo "📋 Próximos pasos:"
echo "1. Verifica en Railway Dashboard → Settings → Variables"
echo "2. Verifica que PostgreSQL y Redis estén conectados"
echo "3. Deploy el proyecto (desde dashboard o GitHub)"
echo ""

