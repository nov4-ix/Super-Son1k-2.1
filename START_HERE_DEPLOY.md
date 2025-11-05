# 🚀 EMPIEZA AQUÍ - DEPLOY COMPLETO

## ✅ TODO ESTÁ LISTO PARA DEPLOY

Todas las correcciones están hechas y commiteadas. Ahora solo necesitas seguir estos pasos.

---

## 📋 ORDEN DE DEPLOY (35 minutos total)

### 1️⃣ BACKEND (Railway) - 15 min ⚡
👉 **Sigue**: `INSTRUCCIONES_DEPLOY_INMEDIATO.md` sección "BACKEND"

**Pasos rápidos:**
1. Railway.app → New Project → GitHub repo
2. Add PostgreSQL → Add Redis
3. Configurar variables de entorno
4. Ejecutar: `npx prisma db push` (en Railway shell)
5. Verificar: `/health` endpoint

**URL resultante**: `https://xxx.railway.app` ← **COPIA ESTA URL**

---

### 2️⃣ GHOST STUDIO (Vercel) - 10 min ⚡
👉 **Sigue**: `INSTRUCCIONES_DEPLOY_INMEDIATO.md` sección "GHOST STUDIO"

**Pasos rápidos:**
1. Vercel.com → Add New Project → GitHub repo
2. Root Directory: `apps/ghost-studio`
3. Variables: `VITE_BACKEND_URL=https://xxx.railway.app` (TU URL DE RAILWAY)
4. Deploy

**URL resultante**: `https://ghost-studio.son1kvers3.com`

---

### 3️⃣ THE GENERATOR (Vercel) - 10 min ⚡
👉 **Sigue**: `INSTRUCCIONES_DEPLOY_INMEDIATO.md` sección "THE GENERATOR"

**Pasos rápidos:**
1. Vercel.com → Add New Project → GitHub repo
2. Root Directory: `apps/the-generator-nextjs`
3. Variables: `NEXT_PUBLIC_BACKEND_URL=https://xxx.railway.app`
4. Deploy

**URL resultante**: `https://the-generator.son1kvers3.com`

---

## 🔑 VARIABLES CRÍTICAS

### Backend (Railway)
```env
DATABASE_URL=auto (Railway lo crea)
REDIS_URL=auto (Railway lo crea)
JWT_SECRET=auto (Railway lo genera)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
FRONTEND_URL=https://ghost-studio.son1kvers3.com,https://the-generator.son1kvers3.com
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_PREMIUM_PRICE_ID=price_xxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxx
```

### Ghost Studio (Vercel)
```env
VITE_BACKEND_URL=https://xxx.railway.app ← CRÍTICO
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_APP_URL=https://ghost-studio.son1kvers3.com
```

### The Generator (Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_BACKEND_URL=https://xxx.railway.app
```

---

## ✅ VERIFICACIÓN POST-DEPLOY

### 1. Backend Health
```bash
curl https://tu-backend.railway.app/health
```
**Debe decir**: `{"status":"healthy"}`

### 2. Ghost Studio
- Abre: `https://ghost-studio.son1kvers3.com`
- Click "Generar (Backend)"
- Debe funcionar ✅

### 3. The Generator
- Abre: `https://the-generator.son1kvers3.com`
- Debe cargar ✅

---

## 🆘 PROBLEMAS COMUNES

### ❌ Backend no responde
**Solución**: Ejecuta migraciones en Railway shell:
```bash
cd packages/backend
npx prisma generate
npx prisma db push
```

### ❌ Ghost Studio no se conecta
**Solución**: Verifica que `VITE_BACKEND_URL` tiene la URL correcta de Railway

### ❌ Error de CORS
**Solución**: Verifica que `FRONTEND_URL` en backend incluye todos los dominios

---

## 📚 DOCUMENTACIÓN COMPLETA

- **`INSTRUCCIONES_DEPLOY_INMEDIATO.md`** - Guía paso a paso rápida
- **`DEPLOY_COMPLETO.md`** - Guía detallada completa
- **`VARIABLES_ENV_COMPLETAS.md`** - Todas las variables explicadas
- **`CORRECCIONES_BETA.md`** - Correcciones realizadas

---

## 🎯 CHECKLIST FINAL

- [ ] Backend en Railway ✅
- [ ] PostgreSQL conectado ✅
- [ ] Migraciones ejecutadas ✅
- [ ] Health check funciona ✅
- [ ] Ghost Studio en Vercel ✅
- [ ] Variables configuradas ✅
- [ ] The Generator en Vercel ✅
- [ ] Testing completo ✅

---

## 🚀 ¡EMPIEZA AHORA!

1. Abre `INSTRUCCIONES_DEPLOY_INMEDIATO.md`
2. Sigue los pasos en orden
3. Verifica cada paso antes de continuar
4. ¡Listo para beta pública! 🎉

---

**Tiempo estimado total: 35 minutos**

