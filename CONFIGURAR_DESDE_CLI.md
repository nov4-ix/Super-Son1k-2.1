# 🚀 Configurar Variables desde CLI

## ✅ Scripts Creados

He creado scripts para configurar las variables desde la terminal:

1. **`scripts/configurar-variables-railway.sh`** - Para Railway (Backend)
2. **`scripts/configurar-variables-vercel.sh`** - Para Vercel (Frontends)

---

## 📋 Requisitos Previos

### 1. Instalar Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 3. Autenticarse

**Railway:**
```bash
railway login
```

**Vercel:**
```bash
vercel login
```

---

## 🚂 Railway (Backend)

### Configurar Variables

```bash
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main
./scripts/configurar-variables-railway.sh
```

**Qué hace:**
- Lee todas las variables de `env.backend.REAL`
- Las configura en Railway automáticamente
- Salta variables que Railway crea automáticamente (DATABASE_URL, REDIS_URL, JWT_SECRET)
- Salta variables con valores placeholder (REEMPLAZA...)

**Después de ejecutar:**
1. Ve a Railway Dashboard
2. Agrega PostgreSQL y Redis (New → Database)
3. Verifica que todas las variables están configuradas
4. Deploy el proyecto

---

## 🎨 Vercel (Frontends)

### Ghost Studio

```bash
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main
./scripts/configurar-variables-vercel.sh ghost-studio
```

### The Generator

```bash
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main
./scripts/configurar-variables-vercel.sh the-generator
```

**Qué hace:**
- Lee las variables del archivo correspondiente
- Las configura en Vercel para producción
- Salta variables que requieren valores reales (TU_BACKEND_RAILWAY...)

**Después de ejecutar:**
1. Agrega manualmente `VITE_BACKEND_URL` o `NEXT_PUBLIC_BACKEND_URL` con la URL de Railway
2. Verifica en Vercel Dashboard
3. Deploy el proyecto

---

## 🔧 Configuración Manual (Alternativa)

Si prefieres configurar manualmente o los scripts no funcionan:

### Railway

```bash
# Ejemplo: Configurar una variable
railway variables set SUPABASE_URL=https://swbnenfucupmtpihmmht.supabase.co

# O desde archivo
railway variables < env.backend.REAL
```

### Vercel

```bash
# Desde el directorio del proyecto
cd apps/ghost-studio
vercel env add VITE_SUPABASE_URL production
# Pega el valor cuando te lo pida

# O usar el archivo .env.local
vercel env pull .env.local
# Edita .env.local con los valores reales
vercel env push .env.local
```

---

## ⚠️ Notas Importantes

1. **Railway crea automáticamente:**
   - `DATABASE_URL` (cuando agregas PostgreSQL)
   - `REDIS_URL` (cuando agregas Redis)
   - `JWT_SECRET` (se genera automáticamente)

2. **Variables que necesitas agregar manualmente:**
   - `STRIPE_WEBHOOK_SECRET` (opcional)
   - `STRIPE_*_PRICE_ID` (opcional)
   - `VITE_BACKEND_URL` / `NEXT_PUBLIC_BACKEND_URL` (después del deploy de Railway)

3. **Verificación:**
   - Siempre verifica en los dashboards que las variables están correctas
   - Algunos valores pueden necesitar ser ajustados manualmente

---

## 🚀 Orden Recomendado

1. **Instalar CLIs y autenticarse**
   ```bash
   npm install -g @railway/cli vercel
   railway login
   vercel login
   ```

2. **Configurar Railway (Backend)**
   ```bash
   ./scripts/configurar-variables-railway.sh
   ```

3. **Deploy Backend en Railway**
   - Agrega PostgreSQL y Redis
   - Deploy
   - Copia la URL del backend

4. **Configurar Vercel (Frontends)**
   ```bash
   ./scripts/configurar-variables-vercel.sh ghost-studio
   ./scripts/configurar-variables-vercel.sh the-generator
   ```

5. **Agregar URLs del Backend**
   - En Vercel Dashboard, agrega `VITE_BACKEND_URL` y `NEXT_PUBLIC_BACKEND_URL` con la URL de Railway

6. **Deploy Frontends**

---

**¡Listo para configurar desde CLI!** 🚀

