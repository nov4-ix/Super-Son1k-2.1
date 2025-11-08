# 🚀 DEPLOY PASO A PASO - App por App

## ✅ PASO 1: BACKEND (Railway) - EN PROGRESO

### 1.1 Linkear Proyecto Railway
```bash
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main
railway link
```
- Selecciona el proyecto existente o crea uno nuevo
- Si ya tienes PostgreSQL y Redis, selecciónalos

### 1.2 Verificar Servicios
- PostgreSQL debe estar conectado (crea `DATABASE_URL` automáticamente)
- Redis debe estar conectado (crea `REDIS_URL` automáticamente)

### 1.3 Configurar Variables de Entorno
Ejecuta el script o configura manualmente desde el dashboard:

```bash
./scripts/configurar-variables-railway.sh
```

O manualmente en Railway Dashboard → Settings → Variables:
- Copia todas las variables de `env.backend.REAL`
- **NO** copies `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET` (Railway los crea)

### 1.4 Deploy Backend
```bash
railway up
```

O desde Railway Dashboard → Deploy

### 1.5 Ejecutar Migraciones Prisma
En Railway Dashboard → Tu servicio backend → Shell:
```bash
cd packages/backend
npx prisma generate
npx prisma db push
```

### 1.6 Obtener URL del Backend
- Railway Dashboard → Settings → Domains
- Copia la URL (ej: `https://xxx.railway.app`)
- **GUARDA ESTA URL** - la necesitarás para los frontends

### 1.7 Verificar Health Check
Abre en navegador: `https://TU_URL_RAILWAY.railway.app/health`
Debe responder: `{"status":"healthy",...}`

---

## ⏳ PASO 2: GHOST STUDIO (Vercel) - PENDIENTE

**Espera a que el backend esté funcionando antes de continuar**

### 2.1 Login en Vercel
```bash
vercel login
```

### 2.2 Linkear Proyecto
```bash
cd apps/ghost-studio
vercel link
```
- Selecciona proyecto existente o crea uno nuevo

### 2.3 Configurar Variables
En Vercel Dashboard → Settings → Environment Variables:
- Copia todas las variables de `env.ghost-studio.REAL`
- **IMPORTANTE**: Actualiza `VITE_BACKEND_URL` con la URL de Railway del paso 1.6

### 2.4 Deploy
```bash
vercel --prod
```

---

## ⏳ PASO 3: THE GENERATOR (Vercel) - PENDIENTE

**Espera a que Ghost Studio esté funcionando**

### 3.1 Linkear Proyecto
```bash
cd apps/the-generator-nextjs
vercel link
```

### 3.2 Configurar Variables
En Vercel Dashboard → Settings → Environment Variables:
- Copia todas las variables de `env.the-generator.REAL`
- **IMPORTANTE**: Actualiza `NEXT_PUBLIC_BACKEND_URL` y `BACKEND_URL` con la URL de Railway

### 3.3 Deploy
```bash
vercel --prod
```

---

## ✅ CHECKLIST FINAL

- [ ] Backend deployado y saludable
- [ ] Migraciones Prisma ejecutadas
- [ ] URL del backend obtenida
- [ ] Ghost Studio deployado con `VITE_BACKEND_URL` configurado
- [ ] The Generator deployado con `NEXT_PUBLIC_BACKEND_URL` configurado
- [ ] Testing completo - generar música desde Ghost Studio

