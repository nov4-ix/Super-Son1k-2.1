# 🚀 Deploy Desde Dashboards (Sin CLI)

## ✅ La Forma Más Simple

Puedes hacer deploy **completamente desde las dashboards web** sin necesidad de instalar herramientas CLI.

---

## 📦 1. BACKEND - Railway (Desde Dashboard)

### Paso 1: Conectar GitHub a Railway

1. Ve a: https://railway.app
2. Click **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Conecta tu cuenta de GitHub si no está conectada
5. Selecciona el repositorio: `Super-Son1k-2.1-main`
6. Railway detectará automáticamente el `railway.toml`

### Paso 2: Agregar PostgreSQL

1. En Railway Dashboard → Click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway creará automáticamente la variable `DATABASE_URL`
3. ✅ Listo - no necesitas configurar nada más

### Paso 3: Agregar Redis

1. Click **"New"** → **"Database"** → **"Add Redis"**
2. Railway creará automáticamente `REDIS_URL`
3. ✅ Listo

### Paso 4: Configurar Variables de Entorno

Ve a **Settings** → **Variables** y agrega:

```env
# Supabase (REQUERIDO)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx

# Stripe (REQUERIDO)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_PREMIUM_PRICE_ID=price_xxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxx

# Frontend URLs (REQUERIDO)
FRONTEND_URL=https://ghost-studio.son1kvers3.com,https://the-generator.son1kvers3.com

# Suno API (OPCIONAL - usa token pool)
SUNO_API_KEY=xxx
```

**Railway ya configuró automáticamente:**
- ✅ `DATABASE_URL` (PostgreSQL)
- ✅ `REDIS_URL` (Redis)
- ✅ `JWT_SECRET` (auto-generado)
- ✅ `PORT=3001`
- ✅ `NODE_ENV=production`

### Paso 5: Ejecutar Migraciones Prisma

**Opción A: Desde Railway Dashboard (Más Fácil)**

1. Ve a tu servicio de backend
2. Click en **"Deployments"**
3. Click en el deployment más reciente
4. Click en **"View Logs"**
5. En la terminal, ejecuta:

```bash
npx prisma generate
npx prisma db push
```

**Opción B: Desde Railway Shell**

1. En Railway Dashboard → Click en tu servicio
2. Click en **"Shell"** (terminal)
3. Ejecuta:

```bash
cd packages/backend
npx prisma generate
npx prisma db push
```

### Paso 6: Verificar Health Check

Una vez deployado, Railway te dará una URL como: `https://tu-proyecto.up.railway.app`

Verifica que funcione:
```bash
curl https://tu-proyecto.up.railway.app/health
```

Debería responder: `{"status":"healthy",...}`

---

## 🎨 2. GHOST STUDIO - Vercel (Desde Dashboard)

### Paso 1: Conectar GitHub a Vercel

1. Ve a: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Selecciona **"Import Git Repository"**
4. Conecta GitHub si no está conectado
5. Selecciona: `Super-Son1k-2.1-main`

### Paso 2: Configurar Proyecto

**IMPORTANTE - Configuración Crítica:**

1. En **"Configure Project"**:
   - **Framework Preset:** Vite
   - **Root Directory:** `apps/ghost-studio` ⚠️ **CRÍTICO**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

2. Click **"Deploy"**

### Paso 3: Configurar Variables de Entorno

Después del primer deploy, ve a **Settings** → **Environment Variables**:

```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_APP_URL=https://ghost-studio.son1kvers3.com
```

**IMPORTANTE:** Selecciona **"Production"** para todas las variables.

### Paso 4: Redeploy

1. Ve a **"Deployments"**
2. Click en los 3 puntos `...` del último deployment
3. Click **"Redeploy"** (esto aplicará las nuevas variables)

---

## 🎵 3. THE GENERATOR - Vercel (Desde Dashboard)

### Paso 1: Crear Nuevo Proyecto en Vercel

1. Ve a: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Selecciona el mismo repositorio: `Super-Son1k-2.1-main`

### Paso 2: Configurar Proyecto

**IMPORTANTE - Configuración Crítica:**

1. En **"Configure Project"**:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/the-generator-nextjs` ⚠️ **CRÍTICO**
   - **Build Command:** `npm run build` (automático)
   - **Output Directory:** `.next` (automático)
   - **Install Command:** `npm install`

2. Click **"Deploy"**

### Paso 3: Configurar Variables de Entorno

Ve a **Settings** → **Environment Variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_BACKEND_URL=https://tu-backend.railway.app
```

**IMPORTANTE:** Selecciona **"Production"** para todas.

### Paso 4: Redeploy

1. Ve a **"Deployments"**
2. Click **"Redeploy"** en el último deployment

---

## 🔄 Deploy Automático Desde GitHub

Una vez configurado, **cada push a `main`** trigger automáticamente:

- ✅ **Railway:** Deploy automático del backend
- ✅ **Vercel:** Deploy automático de Ghost Studio y The Generator

**Para hacer un nuevo deploy:**
```bash
git add .
git commit -m "deploy: trigger automatic deployment"
git push origin main
```

---

## ✅ Verificación Post-Deploy

### 1. Backend Health Check
```bash
curl https://tu-backend.railway.app/health
```

### 2. Ghost Studio
- Abre: `https://ghost-studio.son1kvers3.com`
- Prueba: Click en "Generar (Backend)"
- Debe generar música sin errores

### 3. The Generator
- Abre: `https://the-generator.son1kvers3.com`
- Debe cargar sin errores
- Verifica que la extensión pueda enviar tokens

---

## 🚨 Troubleshooting

### Railway - Error "No Next.js version detected"
- **Solución:** Verifica que `Root Directory` esté vacío o sea correcto
- Railway debería detectar automáticamente desde `railway.toml`

### Vercel - Error "Root Directory does not exist"
- **Solución:** Verifica el path exacto:
  - Ghost Studio: `apps/ghost-studio`
  - The Generator: `apps/the-generator-nextjs`

### Vercel - Error "Multiple deployments"
- **Solución:** Cancela todos los deployments en progreso
- Espera a que uno complete
- Haz un solo push nuevo

---

## 📋 Checklist Final

- [ ] Backend deployado en Railway
- [ ] PostgreSQL conectado y migraciones ejecutadas
- [ ] Health check del backend funciona
- [ ] Ghost Studio deployado en Vercel
- [ ] Variables de entorno configuradas en Ghost Studio
- [ ] The Generator deployado en Vercel
- [ ] Variables de entorno configuradas en The Generator
- [ ] Prueba end-to-end: Generar música desde Ghost Studio
- [ ] Verificar que extensión Chrome pueda enviar tokens

---

## 🎯 Orden Recomendado

1. **Backend primero** (Railway)
2. **Esperar a que backend esté funcionando**
3. **Ghost Studio** (Vercel)
4. **The Generator** (Vercel)
5. **Verificar todo funciona**

---

**¡Listo para deploy!** 🚀

No necesitas instalar nada, solo usar las dashboards web.

