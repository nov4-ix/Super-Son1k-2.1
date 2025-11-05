# 🚀 INSTRUCCIONES DE DEPLOY INMEDIATO

## ⚡ DEPLOY RÁPIDO - Paso a Paso

### 🔧 BACKEND (Railway) - 15 minutos

1. **Ve a Railway**: https://railway.app → Login

2. **Crear Proyecto**:
   - Click "New Project"
   - "Deploy from GitHub repo"
   - Selecciona tu repositorio
   - Railway detectará automáticamente `railway.toml`

3. **Agregar PostgreSQL**:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway creará `DATABASE_URL` automáticamente

4. **Agregar Redis**:
   - Click "New" → "Database" → "Add Redis"
   - Railway creará `REDIS_URL` automáticamente

5. **Configurar Variables de Entorno**:
   - Ve a Settings → Variables
   - Agrega estas variables (las que no están automáticas):
   
   ```
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=xxx
   SUNO_API_URL=https://api.suno.ai/v1
   SUNO_API_KEY=xxx (opcional)
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   STRIPE_PRO_PRICE_ID=price_xxx
   STRIPE_PREMIUM_PRICE_ID=price_xxx
   STRIPE_ENTERPRISE_PRICE_ID=price_xxx
   FRONTEND_URL=https://ghost-studio.son1kvers3.com,https://the-generator.son1kvers3.com
   ```

6. **Ejecutar Migraciones**:
   - En Railway Dashboard → Tu servicio backend
   - Ve a "Settings" → "Deploy Logs"
   - Click en "Open Shell" (o usa Railway CLI)
   - Ejecuta:
     ```bash
     cd packages/backend
     npx prisma generate
     npx prisma db push
     ```

7. **Verificar Health Check**:
   - Ve a Settings → Domains
   - Copia la URL pública (ej: `https://xxx.railway.app`)
   - Abre: `https://xxx.railway.app/health`
   - Debe responder: `{"status":"healthy",...}`

8. **Copiar URL del Backend**:
   - Anota la URL completa (ej: `https://xxx.railway.app`)
   - La necesitarás para Ghost Studio

---

### 🎵 GHOST STUDIO (Vercel) - 10 minutos

1. **Ve a Vercel**: https://vercel.com → Login

2. **Crear Proyecto**:
   - Click "Add New Project"
   - Importa tu repositorio GitHub
   - Configura:
     - **Framework Preset**: Vite
     - **Root Directory**: `apps/ghost-studio`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Configurar Variables de Entorno**:
   - Ve a Settings → Environment Variables
   - Agrega:
   ```
   VITE_BACKEND_URL=https://xxx.railway.app (TU URL DE RAILWAY)
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxx...
   VITE_APP_URL=https://ghost-studio.son1kvers3.com
   VITE_ENVIRONMENT=production
   ```

4. **Deploy**:
   - Click "Deploy"
   - Espera a que termine (2-3 minutos)

5. **Configurar Dominio**:
   - Ve a Settings → Domains
   - Agrega: `ghost-studio.son1kvers3.com`
   - Configura DNS según instrucciones

6. **Verificar**:
   - Abre `https://ghost-studio.son1kvers3.com`
   - Prueba el botón "Generar (Backend)"
   - Debe conectarse al backend

---

### 🎨 THE GENERATOR (Vercel) - 10 minutos

1. **Crear Proyecto en Vercel**:
   - Click "Add New Project"
   - Importa tu repositorio (o agrega otro proyecto)
   - Configura:
     - **Framework Preset**: Next.js
     - **Root Directory**: `apps/the-generator-nextjs`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

2. **Configurar Variables de Entorno**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   NEXT_PUBLIC_BACKEND_URL=https://xxx.railway.app
   BACKEND_URL=https://xxx.railway.app
   ```

3. **Deploy**:
   - Click "Deploy"
   - Espera a que termine

4. **Configurar Dominio**:
   - Ve a Settings → Domains
   - Agrega: `the-generator.son1kvers3.com`

---

## ✅ VERIFICACIÓN FINAL

### 1. Backend Health Check
```bash
curl https://tu-backend.railway.app/health
```
**Debe responder**: `{"status":"healthy",...}`

### 2. Ghost Studio
- Abre: `https://ghost-studio.son1kvers3.com`
- Verifica que carga
- Prueba "Generar (Backend)"
- Debe funcionar

### 3. The Generator
- Abre: `https://the-generator.son1kvers3.com`
- Verifica que carga
- Verifica login funciona

---

## 🆘 SI ALGO FALLA

### Backend no responde
1. Verifica logs en Railway Dashboard
2. Verifica que `DATABASE_URL` está configurado
3. Verifica que ejecutaste migraciones: `npx prisma db push`

### Ghost Studio no se conecta
1. Verifica `VITE_BACKEND_URL` en Vercel
2. Verifica que la URL de Railway es correcta
3. Abre DevTools → Console → Ver errores

### Error de migraciones
```bash
# En Railway Shell o CLI
cd packages/backend
npx prisma generate
npx prisma db push
```

---

## 📋 CHECKLIST RÁPIDO

- [ ] Backend deployado en Railway
- [ ] PostgreSQL agregado y conectado
- [ ] Migraciones ejecutadas (`prisma db push`)
- [ ] Health check funciona
- [ ] Variables de entorno configuradas
- [ ] Ghost Studio deployado en Vercel
- [ ] `VITE_BACKEND_URL` configurado con URL de Railway
- [ ] The Generator deployado en Vercel
- [ ] Testing completo

---

## 🎯 URLs FINALES

- **Backend**: `https://xxx.railway.app`
- **Ghost Studio**: `https://ghost-studio.son1kvers3.com`
- **The Generator**: `https://the-generator.son1kvers3.com`

**¡Listo para beta pública! 🚀**

