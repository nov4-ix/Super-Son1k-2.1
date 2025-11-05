# 🚀 Deploy Automático - Opciones

Como no puedo instalar Node.js directamente, aquí están las opciones para hacer deploy:

---

## ✅ Opción 1: Git Push (Auto-Deploy)

Si Railway y Vercel están conectados a GitHub, solo necesitas hacer push:

```bash
git push origin main
```

Esto trigger automáticamente:
- ✅ Railway: Deploy del backend
- ✅ Vercel: Deploy de Ghost Studio y The Generator

**Verifica:**
- Railway Dashboard → Ver deployments activos
- Vercel Dashboard → Ver deployments activos

---

## ✅ Opción 2: Dashboards Web (Más Simple)

**Sigue esta guía:** `DEPLOY_DESDE_DASHBOARDS.md`

Pasos:
1. Ve a https://railway.app → Conecta GitHub → Deploy Backend
2. Ve a https://vercel.com → Conecta GitHub → Deploy Ghost Studio  
3. Ve a https://vercel.com → Nuevo proyecto → Deploy The Generator

---

## ✅ Opción 3: Instalar Node.js Manualmente

```bash
# Instalar Node.js
brew install node

# O descargar desde: https://nodejs.org/

# Luego instalar herramientas
npm install -g @railway/cli vercel

# Autenticar
railway login
vercel login

# Deploy
./scripts/deploy-all.sh
```

---

## ✅ Opción 4: Usar APIs Directamente

Si tienes tokens de API:

1. **Railway Token:**
   - Ve a: https://railway.app/account/tokens
   - Crea un token

2. **Vercel Token:**
   - Ve a: https://vercel.com/account/tokens
   - Crea un token

3. **Ejecutar script:**
   ```bash
   ./scripts/deploy-via-api.sh
   ```

---

## 🎯 Recomendación

**Para iniciar pruebas rápidamente:**

1. **Si tienes auto-deploy configurado:**
   ```bash
   git push origin main
   ```

2. **Si no tienes auto-deploy:**
   - Usa **Opción 2 (Dashboards)** - es la más simple
   - No necesitas instalar nada
   - Solo conectar GitHub y configurar

---

## 📋 Variables Necesarias

Antes de deploy, asegúrate de tener:

### Railway (Backend)
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_*_PRICE_ID (Pro, Premium, Enterprise)
- FRONTEND_URL

### Vercel (Ghost Studio)
- VITE_BACKEND_URL (URL de Railway)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

### Vercel (The Generator)
- NEXT_PUBLIC_BACKEND_URL (URL de Railway)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

---

**¿Qué opción prefieres usar?**

