# ✅ SOLUCIÓN RÁPIDA - Railway Deploy

## 🎯 Problemas Detectados

1. ❌ Railway CLI `variables set` no funciona (sintaxis cambiada)
2. ❌ `railway up` da timeout (proyecto muy grande)

## ✅ SOLUCIÓN: Usar Railway Dashboard + GitHub Deploy

### PASO 1: Configurar Variables en Dashboard

1. **Abre Railway Dashboard:**
   - https://railway.app
   - Proyecto: **son1k-backend**
   - Servicio: **the-generator** (o el servicio backend)

2. **Ve a Settings → Variables**

3. **Copia y pega estas variables** (una por una):

```env
JWT_SECRET=ccb5dVhFygC20hQ+KM8A9HUnYCM2xpct3M35KTiWadNflSCFE53+YHRhNh7odXegGwbIkoQbMFBCJEv+VyXyxg==
JWT_EXPIRES_IN=7d

SUPABASE_URL=https://swbnenfucupmtpihmmht.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Ym5lbmZ1Y3VwbXRwaWhtbWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY2MDI3OCwiZXhwIjoyMDc1MjM2Mjc4fQ.fEtOCfty1KmGpk0WXktnmqIMHW9jZ5Kffiq2F1YKbYA
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Ym5lbmZ1Y3VwbXRwaWhtbWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjAyNzgsImV4cCI6MjA3NTIzNjI3OH0.7TFVQkfSJAyTWsPcOTcbqBTDw2grBYxHMw9UVtpt6-I

SUNO_API_URL=https://api.suno.ai/v1
SUNO_API_KEY=OPCIONAL_USA_TOKEN_POOL

STRIPE_SECRET_KEY=sk_live_... (ver env.backend.REAL)
STRIPE_PUBLISHABLE_KEY=pk_live_... (ver env.backend.REAL)

FRONTEND_URL=https://ghost-studio.son1kvers3.com,https://the-generator.son1kvers3.com

PORT=3001
HOST=0.0.0.0
NODE_ENV=production
LOG_LEVEL=info

MIN_TOKENS=20
MAX_TOKENS=500
ROTATION_INTERVAL=180000
HEALTH_CHECK_INTERVAL=30000
```

**⚠️ NO copies estas (Railway las crea automáticamente):**
- `DATABASE_URL` (se crea con PostgreSQL)
- `REDIS_URL` (se crea con Redis)

---

### PASO 2: Deploy desde GitHub (Más Confiable)

**Opción A: Si ya está conectado a GitHub**
1. Railway Dashboard → Tu servicio
2. Ve a **Settings** → **Source**
3. Verifica que esté conectado a `Super-Son1k-2.1`
4. Railway hará auto-deploy en cada push

**Opción B: Conectar GitHub ahora**
1. Railway Dashboard → **New** → **Deploy from GitHub repo**
2. Selecciona: `Super-Son1k-2.1`
3. Railway detectará `railway.toml` automáticamente
4. Deploy automático

**Opción C: Trigger manual desde GitHub**
```bash
# Haz un pequeño cambio y push
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main
git commit --allow-empty -m "trigger railway deploy"
git push origin main
```

---

### PASO 3: Verificar Deploy

1. Railway Dashboard → Tu servicio → **Deployments**
2. Espera a que termine el deploy (puede tardar 5-10 minutos)
3. Verifica que no haya errores en los logs

---

### PASO 4: Ejecutar Migraciones Prisma

**En Railway Dashboard:**
1. Ve a tu servicio backend
2. Click en **"Shell"** o **"Deployments"** → **"View Logs"** → **"Open Shell"**
3. Ejecuta:
```bash
cd packages/backend
npx prisma generate
npx prisma db push
```

---

### PASO 5: Obtener URL del Backend

1. Railway Dashboard → **Settings** → **Domains**
2. Copia la URL (ej: `https://xxx.railway.app`)
3. **GUARDA ESTA URL** - la necesitarás para los frontends

---

### PASO 6: Verificar Health Check

Abre en navegador: `https://TU_URL_RAILWAY.railway.app/health`

Debe responder: `{"status":"healthy",...}`

---

## ✅ Checklist

- [ ] Variables configuradas en Railway Dashboard
- [ ] PostgreSQL conectado (verifica que `DATABASE_URL` existe)
- [ ] Redis conectado (verifica que `REDIS_URL` existe)
- [ ] Proyecto conectado a GitHub
- [ ] Deploy completado sin errores
- [ ] Migraciones Prisma ejecutadas
- [ ] Health check responde correctamente
- [ ] URL del backend copiada

---

**¡Una vez completado esto, continúa con Ghost Studio en Vercel!** 🎵

