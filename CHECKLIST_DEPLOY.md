# ✅ Checklist de Deploy - Beta Pública

## 📋 Estado Actual

- ✅ Código corregido y commiteado
- ✅ Push realizado a GitHub (commit: `2932162`)
- ✅ Archivos `.env` creados con todas las variables
- ✅ Documentación completa
- ⏳ Deployments en progreso (verificar dashboards)

---

## 🚂 1. BACKEND - Railway

### Setup Inicial
- [ ] Repositorio conectado: `Super-Son1k-2.1`
- [ ] `railway.toml` detectado automáticamente
- [ ] PostgreSQL agregado (Railway crea `DATABASE_URL` automáticamente)
- [ ] Redis agregado (Railway crea `REDIS_URL` automáticamente)

### Variables de Entorno (Configurar en Railway Dashboard)
- [ ] `SUPABASE_URL` - Tu proyecto Supabase
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Clave de servicio
- [ ] `STRIPE_SECRET_KEY` - Clave secreta de Stripe
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook secret
- [ ] `STRIPE_PRO_PRICE_ID` - Price ID Pro
- [ ] `STRIPE_PREMIUM_PRICE_ID` - Price ID Premium
- [ ] `STRIPE_ENTERPRISE_PRICE_ID` - Price ID Enterprise
- [ ] `FRONTEND_URL` - `https://ghost-studio.son1kvers3.com,https://the-generator.son1kvers3.com`
- [ ] `SUNO_API_KEY` - (Opcional, usa token pool)

### Post-Deploy
- [ ] Deployment exitoso
- [ ] Migraciones ejecutadas: `npx prisma db push`
- [ ] Health check funciona: `curl https://tu-backend.railway.app/health`
- [ ] URL del backend copiada (necesaria para frontends)

---

## 🎨 2. GHOST STUDIO - Vercel

### Setup Inicial
- [ ] Repositorio conectado: `Super-Son1k-2.1`
- [ ] Root Directory: `apps/ghost-studio` ✅
- [ ] Framework: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Variables de Entorno (Configurar en Vercel Dashboard)
- [ ] `VITE_BACKEND_URL` - **CRÍTICO** - URL de Railway (ej: `https://xxx.railway.app`)
- [ ] `VITE_SUPABASE_URL` - URL de Supabase
- [ ] `VITE_SUPABASE_ANON_KEY` - Clave anónima de Supabase
- [ ] `VITE_APP_URL` - `https://ghost-studio.son1kvers3.com`
- [ ] `VITE_ENVIRONMENT` - `production`

### Post-Deploy
- [ ] Deployment exitoso
- [ ] URL funciona: `https://ghost-studio.son1kvers3.com`
- [ ] Prueba "Generar (Backend)" funciona
- [ ] Conexión con backend verificada

---

## 🎵 3. THE GENERATOR - Vercel

### Setup Inicial
- [ ] Nuevo proyecto en Vercel
- [ ] Repositorio conectado: `Super-Son1k-2.1` (el mismo)
- [ ] Root Directory: `apps/the-generator-nextjs` ✅
- [ ] Framework: Next.js
- [ ] Build Command: `npm run build` (automático)
- [ ] Output Directory: `.next` (automático)

### Variables de Entorno (Configurar en Vercel Dashboard)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - URL de Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave anónima
- [ ] `NEXT_PUBLIC_BACKEND_URL` - URL de Railway
- [ ] `BACKEND_URL` - URL de Railway (opcional)
- [ ] `GROQ_API_KEY` - (Opcional, para generación de letras)

### Post-Deploy
- [ ] Deployment exitoso
- [ ] URL funciona: `https://the-generator.son1kvers3.com`
- [ ] Login funciona
- [ ] Extensión Chrome puede enviar tokens

---

## 🧪 4. TESTING COMPLETO

### Backend
- [ ] Health check: `GET /health`
- [ ] Endpoint público: `POST /api/generation-public/create`
- [ ] Status check: `GET /api/generation-public/:id/status`

### Ghost Studio
- [ ] Carga correctamente
- [ ] Botón "Generar (Backend)" funciona
- [ ] Generación de música completa
- [ ] Audio se reproduce correctamente

### The Generator
- [ ] Carga correctamente
- [ ] Login funciona
- [ ] Dashboard funciona
- [ ] Extensión puede enviar tokens

### Extensión Chrome
- [ ] Auto-instalación funciona (si implementado)
- [ ] Token extraction funciona
- [ ] Envío a pool funciona

---

## 📊 5. VERIFICACIÓN FINAL

### URLs Funcionando
- [ ] Backend: `https://tu-backend.railway.app/health`
- [ ] Ghost Studio: `https://ghost-studio.son1kvers3.com`
- [ ] The Generator: `https://the-generator.son1kvers3.com`

### Conexiones
- [ ] Ghost Studio → Backend ✅
- [ ] The Generator → Backend ✅
- [ ] Backend → Supabase ✅
- [ ] Backend → PostgreSQL ✅
- [ ] Backend → Redis ✅

### Flujo End-to-End
- [ ] Usuario genera música en Ghost Studio ✅
- [ ] Backend procesa la generación ✅
- [ ] Audio se guarda en Supabase ✅
- [ ] Usuario puede reproducir el audio ✅

---

## 🚨 Troubleshooting

### Si el backend no responde:
1. Verifica logs en Railway Dashboard
2. Verifica que `DATABASE_URL` está configurado
3. Verifica que ejecutaste migraciones: `npx prisma db push`
4. Verifica health check: `curl https://tu-backend.railway.app/health`

### Si Ghost Studio no se conecta:
1. Verifica `VITE_BACKEND_URL` en Vercel
2. Verifica que la URL de Railway es correcta
3. Abre DevTools → Console → Ver errores
4. Verifica CORS en backend

### Si The Generator no funciona:
1. Verifica variables `NEXT_PUBLIC_*` en Vercel
2. Verifica que Supabase está configurado
3. Verifica logs en Vercel Dashboard

---

## 📝 Archivos de Referencia

- `DEPLOY_DESDE_DASHBOARDS.md` - Guía detallada de deploy
- `DEPLOY_AHORA.md` - Guía rápida
- `GUIA_VARIABLES_ENV.md` - Guía de variables de entorno
- `env.backend` - Variables del backend
- `env.ghost-studio` - Variables de Ghost Studio
- `env.the-generator` - Variables de The Generator
- `VARIABLES_ENV_COMPLETAS.md` - Documentación completa

---

## 🎯 Orden de Ejecución

1. **Backend primero** (Railway)
   - Espera a que termine
   - Configura variables
   - Ejecuta migraciones
   - Verifica health check

2. **Ghost Studio** (Vercel)
   - Configura `VITE_BACKEND_URL` con URL de Railway
   - Deploy
   - Verifica conexión

3. **The Generator** (Vercel)
   - Configura `NEXT_PUBLIC_BACKEND_URL` con URL de Railway
   - Deploy
   - Verifica funcionamiento

4. **Testing completo**
   - Prueba end-to-end
   - Verifica todas las conexiones

---

**¡Marca cada item conforme lo completes!** ✅

