# 🚀 DEPLOY AHORA - Guía Rápida

## ✅ Lo que tienes listo:

1. ✅ Código corregido y listo
2. ✅ Scripts de deploy creados
3. ✅ Guía de deploy desde dashboards
4. ✅ Todo commiteado

---

## 🎯 DEPLOY INMEDIATO (3 opciones)

### Opción 1: Desde Dashboards Web (RECOMENDADO - Sin instalar nada)

**Sigue esta guía:** `DEPLOY_DESDE_DASHBOARDS.md`

**Ventajas:**
- ✅ No necesitas instalar nada
- ✅ Más fácil y visual
- ✅ Manejo de errores más simple

**Pasos rápidos:**
1. Ve a https://railway.app → Conecta GitHub → Deploy Backend
2. Ve a https://vercel.com → Conecta GitHub → Deploy Ghost Studio
3. Ve a https://vercel.com → Nuevo proyecto → Deploy The Generator

---

### Opción 2: Git Push (Si tienes auto-deploy configurado)

Si Railway y Vercel ya están conectados a tu GitHub, puedes hacer:

```bash
git push origin main
```

Esto trigger automáticamente:
- ✅ Railway: Deploy del backend
- ✅ Vercel: Deploy de Ghost Studio y The Generator

**Verifica:**
- Railway Dashboard → Ver si hay deployments activos
- Vercel Dashboard → Ver si hay deployments activos

---

### Opción 3: Instalar CLI y usar scripts

**Primero instala herramientas:**
```bash
# Instalar Node.js (si no está)
brew install node

# Instalar Railway CLI
npm install -g @railway/cli

# Instalar Vercel CLI
npm install -g vercel
```

**Luego autentica:**
```bash
railway login
vercel login
```

**Finalmente deploy:**
```bash
./scripts/deploy-all.sh
```

---

## 📋 Checklist Rápido

Antes de deploy, asegúrate de tener:

- [ ] Variables de Supabase (URL + Service Role Key)
- [ ] Variables de Stripe (Secret Key + Webhook Secret + Price IDs)
- [ ] URL del backend de Railway (para configurar en frontends)
- [ ] Dominios configurados (ghost-studio.son1kvers3.com, the-generator.son1kvers3.com)

---

## 🎯 Orden de Deploy

1. **Backend primero** (Railway)
   - Espera a que termine
   - Verifica health check: `curl https://tu-backend.railway.app/health`
   - Ejecuta migraciones: `npx prisma db push`

2. **Ghost Studio** (Vercel)
   - Configura `VITE_BACKEND_URL` con la URL de Railway
   - Deploy

3. **The Generator** (Vercel)
   - Configura `NEXT_PUBLIC_BACKEND_URL` con la URL de Railway
   - Deploy

---

## 🆘 Si algo falla

### Railway - Error de build
- Verifica logs en Railway Dashboard
- Verifica que `railway.toml` esté en la raíz
- Verifica variables de entorno

### Vercel - Error "Root Directory"
- Ghost Studio: `apps/ghost-studio`
- The Generator: `apps/the-generator-nextjs`

### Backend no responde
- Verifica que PostgreSQL está agregado
- Verifica que ejecutaste migraciones
- Verifica logs en Railway

---

## 📞 Variables que necesitas

**Railway (Backend):**
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_PREMIUM_PRICE_ID=price_xxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxx
FRONTEND_URL=https://ghost-studio.son1kvers3.com,https://the-generator.son1kvers3.com
```

**Vercel (Ghost Studio):**
```
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

**Vercel (The Generator):**
```
NEXT_PUBLIC_BACKEND_URL=https://tu-backend.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

---

## ✅ Verificación Final

```bash
# 1. Backend
curl https://tu-backend.railway.app/health

# 2. Ghost Studio
# Abre: https://ghost-studio.son1kvers3.com
# Prueba: Generar música

# 3. The Generator
# Abre: https://the-generator.son1kvers3.com
# Verifica que carga
```

---

**¡Listo para deploy! 🚀**

**Recomendación:** Usa **Opción 1 (Dashboards)** - es la más simple y no requiere instalar nada.

