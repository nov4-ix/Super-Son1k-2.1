# 📋 Guía de Variables de Entorno

## ✅ Archivos Creados

He creado archivos `.env` basados en `VARIABLES_ENV_COMPLETAS.md`:

1. **`env.completo`** - Todas las variables (backend + frontends)
2. **`env.backend`** - Solo variables del backend (Railway)
3. **`env.ghost-studio`** - Solo variables de Ghost Studio (Vercel)
4. **`env.the-generator`** - Solo variables de The Generator (Vercel)

---

## 🚀 Uso Rápido

### Para Desarrollo Local

**Backend:**
```bash
cp env.backend packages/backend/.env
# Edita packages/backend/.env con tus valores reales
```

**Ghost Studio:**
```bash
cp env.ghost-studio apps/ghost-studio/.env.local
# Edita apps/ghost-studio/.env.local con tus valores reales
```

**The Generator:**
```bash
cp env.the-generator apps/the-generator-nextjs/.env.local
# Edita apps/the-generator-nextjs/.env.local con tus valores reales
```

### Para Producción (Railway/Vercel)

**Railway (Backend):**
1. Ve a Railway Dashboard → Tu proyecto → Settings → Variables
2. Copia las variables de `env.backend`
3. Reemplaza los valores con tus datos reales
4. Guarda

**Vercel (Ghost Studio):**
1. Ve a Vercel Dashboard → Ghost Studio → Settings → Environment Variables
2. Copia las variables de `env.ghost-studio`
3. Reemplaza los valores con tus datos reales
4. Selecciona "Production" para todas
5. Guarda

**Vercel (The Generator):**
1. Ve a Vercel Dashboard → The Generator → Settings → Environment Variables
2. Copia las variables de `env.the-generator`
3. Reemplaza los valores con tus datos reales
4. Selecciona "Production" para todas
5. Guarda

---

## 📝 Variables Críticas

### Backend (Railway)
- ✅ `DATABASE_URL` - PostgreSQL (Railway lo crea automáticamente)
- ✅ `REDIS_URL` - Redis (Railway lo crea automáticamente)
- ✅ `JWT_SECRET` - Railway lo genera automáticamente
- ✅ `SUPABASE_URL` - Tu proyecto Supabase
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Clave de servicio Supabase
- ✅ `STRIPE_SECRET_KEY` - Clave secreta de Stripe
- ✅ `STRIPE_WEBHOOK_SECRET` - Webhook secret de Stripe
- ✅ `FRONTEND_URL` - URLs de frontends (comma-separated)

### Ghost Studio (Vercel)
- ✅ `VITE_BACKEND_URL` - **CRÍTICO** - URL del backend de Railway
- ✅ `VITE_SUPABASE_URL` - URL de Supabase
- ✅ `VITE_SUPABASE_ANON_KEY` - Clave anónima de Supabase

### The Generator (Vercel)
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - URL de Supabase
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave anónima de Supabase
- ✅ `NEXT_PUBLIC_BACKEND_URL` - URL del backend (opcional)

---

## 🔐 Seguridad

⚠️ **IMPORTANTE:**
- ❌ NO commitees archivos `.env` con valores reales
- ✅ Usa `.env.example` para el template
- ✅ `.env.local` está en `.gitignore` (seguro para desarrollo)
- ✅ Variables de producción solo en Railway/Vercel Dashboard

---

## 📊 Orden de Prioridad

Las variables se cargan en este orden:

1. **Variables de sistema** (Railway/Vercel Dashboard) - Máxima prioridad
2. **`.env.local`** (local, no se commitea)
3. **`.env`** (valores por defecto)
4. **Valores por defecto en código**

---

## 🎯 Checklist de Configuración

### Backend (Railway)
- [ ] PostgreSQL agregado (Railway crea `DATABASE_URL` automáticamente)
- [ ] Redis agregado (Railway crea `REDIS_URL` automáticamente)
- [ ] `SUPABASE_URL` configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurado
- [ ] `STRIPE_SECRET_KEY` configurado
- [ ] `STRIPE_WEBHOOK_SECRET` configurado
- [ ] `STRIPE_*_PRICE_ID` configurados (Pro, Premium, Enterprise)
- [ ] `FRONTEND_URL` configurado

### Ghost Studio (Vercel)
- [ ] `VITE_BACKEND_URL` configurado (URL de Railway)
- [ ] `VITE_SUPABASE_URL` configurado
- [ ] `VITE_SUPABASE_ANON_KEY` configurado

### The Generator (Vercel)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurado
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurado
- [ ] `NEXT_PUBLIC_BACKEND_URL` configurado (opcional)

---

## 📚 Referencias

- **Documento completo**: `VARIABLES_ENV_COMPLETAS.md`
- **Railway config**: `railway.toml`
- **Ejemplos**: `env.example`, `apps/ghost-studio/env.local.example`, etc.

---

**¡Todo listo para configurar las variables!** 🚀

