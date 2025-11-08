# 🚀 COMANDOS PARA DEPLOY - Ejecuta en tu Terminal

## ⚠️ IMPORTANTE: Ejecuta estos comandos en tu terminal local (no en Cursor)

---

## 📦 PASO 1: BACKEND (Railway)

### 1.1 Cargar nvm y ejecutar script
```bash
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main

# Cargar nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Ejecutar script de deploy
./scripts/deploy-backend-railway.sh
```

El script te guiará paso a paso:
- ✅ Linkear proyecto Railway
- ✅ Verificar PostgreSQL y Redis
- ✅ Configurar variables de entorno
- ✅ Iniciar deploy

### 1.2 Después del deploy - Ejecutar migraciones Prisma

**En Railway Dashboard:**
1. Ve a tu servicio backend
2. Click en "Shell" o "Deployments" → "View Logs" → "Open Shell"
3. Ejecuta:
```bash
cd packages/backend
npx prisma generate
npx prisma db push
```

### 1.3 Obtener URL del Backend

**En Railway Dashboard:**
1. Ve a Settings → Domains
2. Copia la URL (ej: `https://xxx.railway.app`)
3. **GUARDA ESTA URL** - la necesitarás para los frontends

### 1.4 Verificar Health Check

Abre en navegador: `https://TU_URL_RAILWAY.railway.app/health`

Debe responder: `{"status":"healthy",...}`

---

## 🎵 PASO 2: GHOST STUDIO (Vercel)

**Espera a que el backend esté funcionando antes de continuar**

### 2.1 Login en Vercel
```bash
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main

# Cargar nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Login
vercel login
```

### 2.2 Linkear y Deploy
```bash
cd apps/ghost-studio
vercel link
```

- Selecciona proyecto existente o crea uno nuevo
- Root Directory: `apps/ghost-studio` (o deja vacío si ya está configurado)

### 2.3 Configurar Variables

**En Vercel Dashboard:**
1. Ve a tu proyecto Ghost Studio
2. Settings → Environment Variables
3. Agrega todas las variables de `env.ghost-studio.REAL`
4. **IMPORTANTE**: Actualiza `VITE_BACKEND_URL` con la URL de Railway del paso 1.3

### 2.4 Deploy
```bash
vercel --prod
```

---

## 🎨 PASO 3: THE GENERATOR (Vercel)

**Espera a que Ghost Studio esté funcionando**

### 3.1 Linkear y Deploy
```bash
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main/apps/the-generator-nextjs
vercel link
```

### 3.2 Configurar Variables

**En Vercel Dashboard:**
1. Ve a tu proyecto The Generator
2. Settings → Environment Variables
3. Agrega todas las variables de `env.the-generator.REAL`
4. **IMPORTANTE**: Actualiza `NEXT_PUBLIC_BACKEND_URL` y `BACKEND_URL` con la URL de Railway

### 3.3 Deploy
```bash
vercel --prod
```

---

## ✅ CHECKLIST FINAL

- [ ] Backend deployado y saludable (`/health` responde)
- [ ] Migraciones Prisma ejecutadas
- [ ] URL del backend obtenida y guardada
- [ ] Ghost Studio deployado con `VITE_BACKEND_URL` configurado
- [ ] The Generator deployado con `NEXT_PUBLIC_BACKEND_URL` configurado
- [ ] Testing: Abrir Ghost Studio y generar música

---

## 🆘 SI ALGO FALLA

### Backend no responde
- Verifica logs en Railway Dashboard
- Verifica que PostgreSQL y Redis estén conectados
- Verifica variables de entorno

### Frontend no conecta con backend
- Verifica que `VITE_BACKEND_URL` / `NEXT_PUBLIC_BACKEND_URL` estén correctos
- Verifica CORS en backend (debe incluir URLs de Vercel)
- Verifica que el backend esté funcionando (`/health`)

### Migraciones Prisma fallan
- Verifica `DATABASE_URL` en Railway
- Verifica que PostgreSQL esté activo
- Ejecuta `npx prisma generate` antes de `npx prisma db push`

