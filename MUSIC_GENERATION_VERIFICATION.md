# 🎵 VERIFICACIÓN: GENERACIÓN DE MÚSICA REAL

**OBJETIVO:** Asegurar que TODA la generación usa Suno API REAL, nada de placeholders.

---

## 🔍 ESTADO ACTUAL DEL CÓDIGO

### ✅ **The Generator Next.js** (REAL)
- ✅ Llama a backend: `http://localhost:3001/api/generation/create`
- ✅ Usa Token Pool real (`lib/unified-token-pool.ts`)
- ✅ Traduce con Groq API
- ⚠️ **PROBLEMA:** Backend debe estar corriendo en `localhost:3001`

### ✅ **Ghost Studio** (REAL)
- ✅ `useSunoCover.ts` → Llama directamente a Suno: `https://usa.imgkits.com/node-api/suno/cover`
- ✅ `BackendGenerateButton.tsx` → Llama a backend: `http://localhost:4000` (puerto diferente!)
- ⚠️ **PROBLEMA:** Necesita `VITE_SUNO_API_KEY` en envs

### ✅ **Backend Fastify** (REAL)
- ✅ `SunoService.generateMusic()` → Llama a Suno API real
- ✅ Usa `TokenManager` para tokens saludables
- ⚠️ **PROBLEMA:** Necesita tokens en la base de datos

---

## 🚨 ACCIONES CRÍTICAS PARA BETA

### 1. BACKEND DEPLOYMENT (PRIORIDAD MÁXIMA)

**Opciones:**
- Railway (recomendado: fácil setup)
- Render
- Heroku
- VPS propio

**Pasos:**
```bash
# 1. Setup .env en packages/backend/
DATABASE_URL=postgresql://...  # PostgreSQL real, no SQLite
PORT=3001
FRONTEND_URL=https://the-generator.vercel.app,https://ghost-studio.vercel.app
BACKEND_SECRET=tu-secret-key

# 2. Deploy
cd packages/backend
# Railway CLI o Render CLI
railway up
# O manual: Docker + Railway/Render

# 3. Obtener URL pública
# Ejemplo: https://son1kverse-backend.railway.app
```

**Verificar:**
- [ ] Backend responde: `GET https://tu-backend.railway.app/health`
- [ ] Health check muestra servicios OK
- [ ] Database conectada

---

### 2. TOKENS SUNO EN BASE DE DATOS

**The Generator usa Token Pool desde Supabase:**
```bash
# Verificar que hay tokens en:
# Supabase → Table: suno_tokens o unified_token_pool

# Si no hay tokens:
# 1. Agregar tokens via dashboard de The Generator
# 2. O script: apps/the-generator-nextjs/add-valid-token.ts
```

**Backend usa tokens desde Prisma:**
```bash
# Verificar tokens en DB:
cd packages/backend
npm run db:studio
# Ver tabla "tokens"

# Si no hay tokens:
# Usar script: packages/backend/add_token.js
# O endpoint: POST /api/tokens/add (protegido)
```

**Verificar:**
- [ ] Mínimo 2-3 tokens activos en DB
- [ ] Tokens tienen `isValid: true`, `isActive: true`
- [ ] Tokens tienen `expiresAt` futuro (o null)

---

### 3. ACTUALIZAR URLs EN APPS

**The Generator Next.js:**
```typescript
// apps/the-generator-nextjs/app/api/generate-music/route.ts
// LÍNEA 149: Cambiar localhost por URL de producción

const BACKEND_URL = process.env.BACKEND_URL || 'https://tu-backend.railway.app'

let response = await fetch(`${BACKEND_URL}/api/generation/create`, {
  // ...
})
```

**Ghost Studio:**
```typescript
// apps/ghost-studio/src/components/BackendGenerateButton.tsx
// LÍNEA 8: Actualizar URL

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 
  'https://tu-backend.railway.app'
```

**Variables de entorno Vercel:**
- [ ] `BACKEND_URL` → URL del backend deployado
- [ ] `VITE_BACKEND_URL` → (para Ghost Studio)
- [ ] `VITE_SUNO_API_KEY` → (si Ghost Studio usa API directa)

---

### 4. VERIFICAR SUNO API ENDPOINTS

**Endpoints que usa el código:**

1. **The Generator → Backend → Suno:**
   - Backend llama a: `https://api.suno.ai/v1/generate` (o similar)
   - Verificar en `packages/backend/src/services/sunoService.ts` línea 61

2. **Ghost Studio → Suno Directo:**
   - Llama a: `https://usa.imgkits.com/node-api/suno/cover`
   - Verificar en `apps/ghost-studio/src/hooks/useSunoCover.ts` línea 50

**Verificar:**
- [ ] Endpoints son correctos (puede haber cambiado Suno API)
- [ ] Headers incluyen `Authorization: Bearer {token}`
- [ ] Payload tiene formato correcto

---

## ✅ CHECKLIST FINAL (ANTES DE BETA)

### Backend:
- [ ] Deployado en Railway/Render
- [ ] Health check: `GET /health` responde OK
- [ ] Database conectada (PostgreSQL)
- [ ] Mínimo 2 tokens Suno en DB
- [ ] Endpoints funcionan: `/api/generation/create` responde

### The Generator:
- [ ] `.env` tiene `BACKEND_URL` → URL del backend deployado
- [ ] Frontend llama a `${BACKEND_URL}/api/generation/create`
- [ ] Polling funciona: `GET ${BACKEND_URL}/api/generation/:id/status`
- [ ] Token pool tiene tokens (o usa backend tokens)

### Ghost Studio:
- [ ] `.env` tiene `VITE_BACKEND_URL` → URL del backend
- [ ] O `VITE_SUNO_API_KEY` si usa API directa
- [ ] Upload audio funciona
- [ ] Cover generation inicia correctamente

### Prueba End-to-End:
- [ ] The Generator: Escribir prompt → Click Generate → Esperar → Audio se reproduce
- [ ] Ghost Studio: Upload audio → Click Generate Cover → Esperar → Audio se reproduce
- [ ] NO hay errores 401/403/404/500
- [ ] Audio URL es válida y se descarga

---

## 🧪 TEST MANUAL (5 minutos)

### Test 1: The Generator
```bash
# 1. Abrir The Generator en Vercel
# 2. Escribir prompt: "electronic dance music, upbeat, 120 BPM"
# 3. Click "Generate"
# 4. Verificar que muestra "Processing..."
# 5. Esperar 60-120 segundos
# 6. Verificar que aparece audio player
# 7. Click play → Audio se reproduce ✅
```

### Test 2: Ghost Studio
```bash
# 1. Abrir Ghost Studio en Vercel
# 2. Upload un archivo audio pequeño (5-10 MB)
# 3. Escribir prompt: "synthwave cover"
# 4. Click "Generate Cover"
# 5. Verificar que muestra progress
# 6. Esperar 60-120 segundos
# 7. Verificar que aparece audio player
# 8. Click play → Audio se reproduce ✅
```

### Test 3: Backend Health
```bash
# Terminal:
curl https://tu-backend.railway.app/health

# Debe responder:
{
  "status": "healthy",
  "services": {
    "database": "healthy",
    "tokenManager": "healthy",
    "sunoService": "healthy"
  }
}
```

---

## 🚨 SI ALGO FALLA

### Error 401/403:
→ Token inválido o expirado
→ Verificar tokens en DB, agregar nuevos si necesario

### Error 404:
→ URL incorrecta
→ Verificar `BACKEND_URL` en envs

### Error 500:
→ Backend error
→ Revisar logs del backend (Railway/Render dashboard)
→ Verificar que SunoService tiene tokens disponibles

### Timeout:
→ Suno API lenta
→ Aumentar timeout en código
→ Verificar que Suno API está funcionando

### "No tokens available":
→ Token pool vacío
→ Agregar tokens via dashboard o script

---

## 📝 POST-BETA (Mejoras)

- [ ] Monitoreo de tokens (alertas cuando quedan pocos)
- [ ] Auto-rotación de tokens más inteligente
- [ ] Queue system para cuando hay muchos requests
- [ ] Caching de generaciones similares
- [ ] Rate limiting más sofisticado

---

**🎵 Generación REAL = Beta exitosa!**

