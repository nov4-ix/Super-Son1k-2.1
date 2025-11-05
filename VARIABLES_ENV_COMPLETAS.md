# 📋 Variables de Entorno Completas - Super-Son1k-2.1

## 🎯 Resumen por Aplicación

### 1. Backend (Railway/Producción)
### 2. Ghost Studio (Vercel)
### 3. The Generator NextJS (Vercel)
### 4. Extensión Chrome

---

## 🔧 1. BACKEND - Packages/Backend

### Variables Críticas (Requeridas)

```env
# Database - PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis
REDIS_URL=redis://host:6379
# O alternativamente:
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key (opcional, para algunos endpoints)

# Suno API
SUNO_API_URL=https://api.suno.ai/v1
SUNO_API_KEY=your-suno-api-key (opcional, usa token pool)

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# Frontend URLs (comma-separated)
FRONTEND_URL=http://localhost:3000,http://localhost:3001,https://ghost-studio.son1kvers3.com,https://the-generator.son1kvers3.com

# Server
PORT=3001
HOST=0.0.0.0
NODE_ENV=production
LOG_LEVEL=info
```

### Variables Opcionales

```env
# Rate Limiting
GLOBAL_RATE_LIMIT_MAX=100
GLOBAL_RATE_LIMIT_WINDOW_MS=60000

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads

# Token Pool Configuration
MIN_TOKENS=20
MAX_TOKENS=500
ROTATION_INTERVAL=180000
HEALTH_CHECK_INTERVAL=30000

# Analytics
POSTHOG_API_KEY=your-posthog-api-key
POSTHOG_HOST=https://app.posthog.com

# Monitoring
SENTRY_DSN=your-sentry-dsn

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000

# Cache Configuration
CACHE_TTL_DEFAULT=3600
CACHE_TTL_TOKENS=300
CACHE_TTL_USER_DATA=1800
CACHE_TTL_GENERATION_RESULTS=3600
CACHE_TTL_ANALYTICS=900
CACHE_TTL_TEMPLATES=7200
```

---

## 🎵 2. GHOST STUDIO - Apps/Ghost-Studio

### Variables Requeridas

```env
# Backend URL (CRÍTICO - Para generación de música)
VITE_BACKEND_URL=http://localhost:3001
# En producción: https://your-backend.railway.app

# Supabase (para almacenamiento de audio)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Suno API (opcional, si no usas backend)
VITE_SUNO_API_KEY=your_suno_api_key_here

# App Configuration
VITE_APP_URL=http://localhost:3001
VITE_ENVIRONMENT=development
```

### Variables Opcionales

```env
# Analytics
VITE_ANALYTICS_ID=your_analytics_id

# Error Tracking
VITE_SENTRY_DSN=your_sentry_dsn
```

**Archivo**: `apps/ghost-studio/env.local.example`

---

## 🎨 3. THE GENERATOR NEXTJS - Apps/The-Generator-Nextjs

### Variables Requeridas

```env
# Supabase (para autenticación y base de datos)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend (opcional, para generación)
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
BACKEND_URL=https://your-backend.railway.app
BACKEND_SECRET=dev-token (opcional)

# Suno API (opcional, si no usas backend)
SUNO_COOKIE=your-suno-cookie (opcional)

# Groq API (para generación de letras)
GROQ_API_KEY=your-groq-api-key
```

### Variables Opcionales

```env
# Music API Configuration
VITE_MUSIC_API_PROVIDER=suno
VITE_MUSIC_API_BASE_URL=https://api.sunoapi.com/v1
VITE_SUNO_API_KEY=your_suno_api_key_here

# App Configuration
VITE_APP_URL=http://localhost:3002
VITE_ENVIRONMENT=development

# Features
VITE_ENABLE_LYRIC_GENERATOR=true

# Extension Configuration
NEXT_PUBLIC_EXTENSION_ID=your-extension-id
NEXT_PUBLIC_EXTENSION_URL=chrome-extension://...
```

**Archivo**: `apps/the-generator-nextjs/env.local.example`

---

## 🔌 4. EXTENSIÓN CHROME

### Variables (configuradas en el código)

La extensión NO usa variables de entorno tradicionales, pero tiene configuración en:
- `extensions/suno-extension/background.js`
- `extensions/suno-extension/manifest.json`

### Configuración Interna

```javascript
// Generator URL (configurado en el código)
generatorUrl = 'https://the-generator.son1kvers3.com'

// Endpoints
/api/token-pool/add
```

---

## 📊 Tabla Comparativa por Entorno

| Variable | Backend | Ghost Studio | The Generator | Requerida |
|----------|---------|--------------|---------------|-----------|
| `DATABASE_URL` | ✅ | ❌ | ❌ | ✅ Backend |
| `REDIS_URL` | ✅ | ❌ | ❌ | ✅ Backend |
| `JWT_SECRET` | ✅ | ❌ | ❌ | ✅ Backend |
| `SUPABASE_URL` | ✅ | ✅ | ✅ | ✅ Todas |
| `SUPABASE_ANON_KEY` | ❌ | ✅ | ✅ | ✅ Frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ | ❌ | ✅ Backend |
| `SUNO_API_URL` | ✅ | ❌ | ❌ | ⚠️ Backend (opcional) |
| `SUNO_API_KEY` | ⚠️ | ⚠️ | ⚠️ | ⚠️ Opcional (usa token pool) |
| `STRIPE_SECRET_KEY` | ✅ | ❌ | ❌ | ✅ Backend |
| `FRONTEND_URL` | ✅ | ❌ | ❌ | ✅ Backend |
| `VITE_BACKEND_URL` | ❌ | ✅ | ❌ | ✅ Ghost Studio |
| `NEXT_PUBLIC_BACKEND_URL` | ❌ | ❌ | ✅ | ⚠️ The Generator |
| `GROQ_API_KEY` | ❌ | ❌ | ✅ | ⚠️ The Generator |

---

## 🚀 Configuración para Deploy

### Railway (Backend)

```toml
# railway.toml ya configurado con:
DATABASE_URL = { type = "postgresql", default = true }
REDIS_URL = { type = "redis", default = true }
JWT_SECRET = { generate = true }
PORT = "3001"
NODE_ENV = "production"
LOG_LEVEL = "info"

# Configurar manualmente en Railway Dashboard:
SUPABASE_URL = "https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "xxx"
SUNO_API_URL = "https://api.suno.ai/v1"
SUNO_API_KEY = "xxx" (opcional)
STRIPE_SECRET_KEY = "sk_xxx"
STRIPE_WEBHOOK_SECRET = "whsec_xxx"
STRIPE_PRO_PRICE_ID = "price_xxx"
STRIPE_PREMIUM_PRICE_ID = "price_xxx"
STRIPE_ENTERPRISE_PRICE_ID = "price_xxx"
FRONTEND_URL = "https://ghost-studio.son1kvers3.com,https://the-generator.son1kvers3.com"
```

### Vercel (Ghost Studio)

```bash
# En Vercel Dashboard → Settings → Environment Variables:
VITE_BACKEND_URL = https://your-backend.railway.app
VITE_SUPABASE_URL = https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJxxx...
VITE_SUNO_API_KEY = xxx (opcional)
VITE_APP_URL = https://ghost-studio.son1kvers3.com
VITE_ENVIRONMENT = production
```

### Vercel (The Generator)

```bash
# En Vercel Dashboard → Settings → Environment Variables:
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxxx...
NEXT_PUBLIC_BACKEND_URL = https://your-backend.railway.app
BACKEND_URL = https://your-backend.railway.app
BACKEND_SECRET = dev-token (opcional)
GROQ_API_KEY = xxx (opcional)
SUNO_COOKIE = xxx (opcional)
```

---

## ✅ Checklist de Configuración

### Backend
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `REDIS_URL` - Redis connection string
- [ ] `JWT_SECRET` - Secret key for JWT tokens
- [ ] `SUPABASE_URL` - Supabase project URL
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- [ ] `FRONTEND_URL` - Comma-separated frontend URLs
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook secret
- [ ] `PORT` - Server port (default: 3001)

### Ghost Studio
- [ ] `VITE_BACKEND_URL` - Backend URL (CRÍTICO)
- [ ] `VITE_SUPABASE_URL` - Supabase URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `VITE_APP_URL` - App URL

### The Generator
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `NEXT_PUBLIC_BACKEND_URL` - Backend URL (opcional)

---

## 📝 Notas Importantes

1. **Backend URL**: Ghost Studio **REQUIERE** `VITE_BACKEND_URL` para generar música. Sin esto, la generación no funcionará.

2. **Supabase**: Todos los frontends necesitan las claves públicas (`ANON_KEY`), pero el backend necesita la clave de servicio (`SERVICE_ROLE_KEY`).

3. **Suno API**: El backend usa un **token pool** unificado, no requiere `SUNO_API_KEY` directamente si hay tokens en el pool.

4. **Stripe**: Solo el backend necesita las claves de Stripe para manejar pagos.

5. **Variables VITE_**: Solo funcionan en Vite (Ghost Studio). Next.js usa `NEXT_PUBLIC_`.

6. **Seguridad**: Nunca expongas `SERVICE_ROLE_KEY` en el frontend. Solo `ANON_KEY` es segura para el frontend.

---

## 🔗 Archivos de Referencia

- `env.example` - Root level, backend variables
- `apps/ghost-studio/env.local.example` - Ghost Studio variables
- `apps/the-generator-nextjs/env.local.example` - The Generator variables
- `railway.toml` - Railway deployment configuration
- `packages/backend/src/index.ts` - Backend server configuration
- `apps/ghost-studio/src/components/BackendGenerateButton.tsx` - Backend URL usage

