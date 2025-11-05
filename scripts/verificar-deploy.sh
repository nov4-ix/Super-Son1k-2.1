#!/bin/bash

# ✅ Script de Verificación Post-Deploy
# Uso: ./scripts/verificar-deploy.sh <BACKEND_URL>

set -e

BACKEND_URL=${1:-"https://your-backend.railway.app"}

echo "🔍 Verificando deploy..."

# Verificar health check
echo "1. Verificando health check del backend..."
HEALTH_RESPONSE=$(curl -s "${BACKEND_URL}/health" || echo "ERROR")

if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo "✅ Backend está healthy"
    echo "$HEALTH_RESPONSE" | jq '.' 2>/dev/null || echo "$HEALTH_RESPONSE"
else
    echo "❌ Backend no está healthy"
    echo "Respuesta: $HEALTH_RESPONSE"
    exit 1
fi

echo ""
echo "2. Verificando endpoints públicos..."

# Verificar endpoint de generación pública
echo "   - POST /api/generation-public/create"
CREATE_TEST=$(curl -s -X POST "${BACKEND_URL}/api/generation-public/create" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","style":"pop","duration":60,"quality":"standard"}' \
  || echo "ERROR")

if echo "$CREATE_TEST" | grep -q "generationId"; then
    echo "   ✅ Endpoint de creación funciona"
else
    echo "   ❌ Endpoint de creación no funciona"
    echo "   Respuesta: $CREATE_TEST"
fi

echo ""
echo "✅ Verificación completada"
echo ""
echo "📋 URLs para verificar manualmente:"
echo "- Backend Health: ${BACKEND_URL}/health"
echo "- Ghost Studio: https://ghost-studio.son1kvers3.com"
echo "- The Generator: https://the-generator.son1kvers3.com"

