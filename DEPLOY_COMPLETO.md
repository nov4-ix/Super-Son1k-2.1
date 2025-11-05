# 🚀 Guía de Deploy Completo - Beta Pública

## 📋 Checklist Pre-Deploy

- [x] Código corregido y commiteado
- [x] PostgreSQL configurado en schema
- [x] Endpoints públicos funcionando
- [x] Variables de entorno documentadas

---

## 🔧 1. BACKEND - Railway Deploy

### Paso 1: Conectar Repositorio a Railway

1. Ve a https://railway.app
2. Click en "New Project" → "Deploy from GitHub repo"
3. Selecciona el repositorio `Super-Son1k-2.1-main`
4. Railway detectará automáticamente el `railway.toml`

### Paso 2: Agregar Servicios

#### PostgreSQL
1. En Railway Dashboard → Click en "New" → "Database" → "Add PostgreSQL"
2. Railway creará automáticamente `DATABASE_URL`
3. Copia la URL de conexión

#### Redis
1. Click en "New" → "Database" → "Add Redis"
2. Railway creará automáticamente `REDIS_URL`

### Paso 3: Configurar Variables de Entorno

En Railway Dashboard → Settings → Variables:

```env
# Ya configuradas automáticamente por Railway:
DATABASE_URL=<auto-generado>
REDIS_URL=<auto-generado>
JWT_SECRET=<auto-generado>
PORT=3001
NODE_ENV=production
LOG_LEVEL=info

# Configurar manualmente:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUNO_API_URL=https://api.suno.ai/v1
SUNO_API_KEY=your-suno-api-key (opcional, usa token pool)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
FRONTEND_URL=https://ghost-studio.son1kvers3.com,https://the-generator.son1kvers3.com
```

### Paso 4: Configurar Build Settings

Railway debería detectar automáticamente desde `railway.toml`, pero verifica:

- **Root Directory**: (dejar vacío - raíz del proyecto)
- **Build Command**: `cd packages/backend && npm install && npm run build`
- **Start Command**: `cd packages/backend && npm run start`
- **Healthcheck Path**: `/health`

### Paso 5: Ejecutar Migraciones Prisma

**Opción A: Desde Railway Dashboard (Recomendado)**

1. En Railway Dashboard → Click en tu servicio backend
2. Ve a "Settings" → "Deploy Script"
3. Agrega script de migración:

```bash
# Build command
cd packages/backend && npm install && npm run build

# Post-deploy script (ejecutar manualmente la primera vez)
cd packages/backend && npx prisma generate && npx prisma db push
```

**Opción B: Desde Railway CLI**

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link proyecto
railway link

# Ejecutar migraciones
cd packages/backend
railway run npx prisma generate
railway run npx prisma db push
```

### Paso 6: Verificar Deploy

1. Espera a que Railway termine el deploy
2. Ve a tu servicio → "Settings" → "Domains"
3. Copia la URL pública (ej: `https://your-backend.railway.app`)
4. Verifica health check: `https://your-backend.railway.app/health`

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "...",
  "services": {
    "database": "healthy",
    "tokenManager": "healthy",
    "sunoService": "healthy"
  }
}
```

---

## 🎵 2. GHOST STUDIO - Vercel Deploy

### Paso 1: Conectar Repositorio a Vercel

1. Ve a https://vercel.com/dashboard
2. Click en "Add New Project"
3. Importa el repositorio `Super-Son1k-2.1-main`
4. Configura el proyecto:

**Project Settings:**
- **Framework Preset**: Vite
- **Root Directory**: `apps/ghost-studio`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Paso 2: Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:

```env
# Backend URL (CRÍTICO - usar URL de Railway)
VITE_BACKEND_URL=https://your-backend.railway.app

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
VITE_APP_URL=https://ghost-studio.son1kvers3.com
VITE_ENVIRONMENT=production

# Opcional
VITE_SUNO_API_KEY=your_suno_api_key (opcional)
VITE_ANALYTICS_ID=your_analytics_id (opcional)
```

### Paso 3: Configurar Dominio Personalizado

1. Ve a Settings → Domains
2. Agrega: `ghost-studio.son1kvers3.com`
3. Configura DNS según instrucciones de Vercel

### Paso 4: Deploy

1. Click en "Deploy"
2. Espera a que termine el build
3. Verifica que el deploy fue exitoso

### Paso 5: Verificar Funcionamiento

1. Abre `https://ghost-studio.son1kvers3.com`
2. Verifica que la página carga
3. Prueba el botón "Generar (Backend)"
4. Verifica que se conecta al backend de Railway

---

## 🎨 3. THE GENERATOR - Vercel Deploy

### Paso 1: Conectar Repositorio a Vercel

1. Ve a https://vercel.com/dashboard
2. Click en "Add New Project"
3. Importa el repositorio (o usa el mismo proyecto si es monorepo)
4. Configura el proyecto:

**Project Settings:**
- **Framework Preset**: Next.js
- **Root Directory**: `apps/the-generator-nextjs`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Paso 2: Configurar Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend (opcional)
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
BACKEND_URL=https://your-backend.railway.app
BACKEND_SECRET=dev-token (opcional)

# Opcional
GROQ_API_KEY=your-groq-api-key
SUNO_COOKIE=your-suno-cookie
```

### Paso 3: Configurar Dominio Personalizado

1. Ve a Settings → Domains
2. Agrega: `the-generator.son1kvers3.com`
3. Configura DNS según instrucciones

### Paso 4: Deploy

1. Click en "Deploy"
2. Espera a que termine el build
3. Verifica que el deploy fue exitoso

---

## ✅ 4. VERIFICACIÓN COMPLETA

### Backend (Railway)

```bash
# Health check
curl https://your-backend.railway.app/health

# Debería responder:
{
  "status": "healthy",
  "services": {
    "database": "healthy",
    "tokenManager": "healthy",
    "sunoService": "healthy"
  }
}
```

### Ghost Studio (Vercel)

1. Abre `https://ghost-studio.son1kvers3.com`
2. Verifica que la página carga
3. Abre DevTools → Console
4. Verifica que no hay errores
5. Prueba generar música:
   - Click en "Generar (Backend)"
   - Verifica que se conecta al backend
   - Verifica que recibe respuesta

### The Generator (Vercel)

1. Abre `https://the-generator.son1kvers3.com`
2. Verifica que la página carga
3. Verifica autenticación funciona
4. Prueba generar música

---

## 🔍 5. TROUBLESHOOTING

### Backend no responde

1. Verifica logs en Railway Dashboard
2. Verifica que `DATABASE_URL` está configurado
3. Verifica que `PORT=3001` está configurado
4. Verifica que las migraciones se ejecutaron

### Ghost Studio no se conecta al backend

1. Verifica `VITE_BACKEND_URL` en Vercel
2. Verifica que la URL de Railway es correcta
3. Verifica CORS en backend (debe incluir el dominio de Vercel)
4. Abre DevTools → Network → Verifica requests

### Error de migraciones Prisma

```bash
# Ejecutar manualmente en Railway
cd packages/backend
railway run npx prisma generate
railway run npx prisma db push
```

### CORS Errors

Verifica en `packages/backend/src/index.ts` que `FRONTEND_URL` incluye:
- `https://ghost-studio.son1kvers3.com`
- `https://the-generator.son1kvers3.com`
- `https://ghost-studio.vercel.app` (para previews)

---

## 📊 6. TESTING FINAL

### Test 1: Backend Health
```bash
curl https://your-backend.railway.app/health
```

### Test 2: Generación Pública (Ghost Studio)
1. Abre Ghost Studio
2. Escribe un prompt
3. Click "Generar (Backend)"
4. Verifica que:
   - Se crea la generación
   - Se recibe `generationId`
   - Se puede consultar status
   - Eventualmente se completa con `audioUrl`

### Test 3: Generación Autenticada (The Generator)
1. Abre The Generator
2. Login
3. Genera música
4. Verifica que funciona

---

## 🎯 URLs Finales

- **Backend**: `https://your-backend.railway.app`
- **Ghost Studio**: `https://ghost-studio.son1kvers3.com`
- **The Generator**: `https://the-generator.son1kvers3.com`

---

## 📝 Notas Importantes

1. **Primera vez**: Debes ejecutar migraciones Prisma manualmente en Railway
2. **Variables**: Todas las variables deben estar configuradas antes del deploy
3. **CORS**: Verifica que `FRONTEND_URL` incluye todos los dominios
4. **Health Check**: Verifica `/health` después de cada deploy
5. **Logs**: Revisa logs en Railway y Vercel si hay problemas

---

## ✅ Checklist Final

- [ ] Backend deployado en Railway
- [ ] PostgreSQL conectado y migrado
- [ ] Redis conectado
- [ ] Health check responde `healthy`
- [ ] Ghost Studio deployado en Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] Ghost Studio se conecta al backend
- [ ] The Generator deployado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Testing completo exitoso
- [ ] Generación de música funciona end-to-end

