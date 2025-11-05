# 🔑 VARIABLES DE ENTORNO NECESARIAS - BETA

**Fecha:** 2025-11-02

---

## 📋 BACKEND (Railway/Render)

### 🔴 **CRÍTICAS (Sin estas no funciona)**

```env
# Database - PostgreSQL (CRÍTICO)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT - Secret para tokens (CRÍTICO)
JWT_SECRET=tu-secret-super-seguro-minimo-32-caracteres
JWT_EXPIRES_IN=7d

# CORS - URLs de producción (CRÍTICO - debe incluir todas las apps)
FRONTEND_URL=https://the-generator.son1kvers3.com,https://ghost-studio.vercel.app,https://the-generator.vercel.app

# Server
PORT=3001
NODE_ENV=production
```

### 🟡 **IMPORTANTES (Recomendadas)**

```env
# Redis (Opcional pero recomendado para cache)
REDIS_HOST=redis-host-url
REDIS_PORT=6379
REDIS_PASSWORD=redis-password

# Supabase (Si usas Supabase para algo en backend)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Logging
LOG_LEVEL=info
```

### ⚪ **OPCIONALES**

```env
# Suno API (Si backend necesita acceso directo)
SUNO_API_KEY=opcional

# Stripe (Si usas pagos)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📋 THE GENERATOR NEXT.JS (Vercel)

### 🔴 **CRÍTICAS**

```env
# Backend URL (CRÍTICO - URL del backend deployado)
BACKEND_URL=https://tu-backend.railway.app
NEXT_PUBLIC_BACKEND_URL=https://tu-backend.railway.app

# Supabase (CRÍTICO - Para token pool)
NEXT_PUBLIC_SUPABASE_URL=https://swbnenfucupmtpihmmht.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Ym5lbmZ1Y3VwbXRwaWhtbWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjAyNzgsImV4cCI6MjA3NTIzNjI3OH0.7TFVQkfSJAyTWsPcOTcbqBTDw2grBYxHMw9UVtpt6-I

# Groq API (IMPORTANTE - Para traducción automática)
GROQ_API_KEY=tu-groq-api-key-aqui

# Ambiente
NODE_ENV=production
```

### 🟡 **OPCIONALES**

```env
# Admin Password (Opcional - Para /api/pool/add)
NEXT_PUBLIC_ADMIN_PASSWORD=tu-password-seguro

# Supabase Service Key (Opcional - Para operaciones admin)
SUPABASE_SERVICE_KEY=tu-service-key-si-tienes
```

---

## 📋 GHOST STUDIO (Vercel)

### 🔴 **CRÍTICAS**

```env
# Backend URL (CRÍTICO)
VITE_BACKEND_URL=https://tu-backend.railway.app

# Ambiente
VITE_ENVIRONMENT=production
```

### 🟡 **OPCIONALES (Solo si usas storage de Supabase)**

```env
# Supabase (Opcional - Solo si Ghost Studio guarda archivos)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### ⚪ **NO NECESARIAS**

```env
# Estas NO son necesarias si usas backend
# VITE_SUNO_API_KEY=no-necesaria-si-usas-backend
```

---

## 📋 RESUMEN POR PRIORIDAD

### 🔴 **MÍNIMO PARA FUNCIONAR**

#### Backend:
```
DATABASE_URL
JWT_SECRET
FRONTEND_URL
PORT=3001
NODE_ENV=production
```

#### The Generator:
```
BACKEND_URL
NEXT_PUBLIC_BACKEND_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GROQ_API_KEY
NODE_ENV=production
```

#### Ghost Studio:
```
VITE_BACKEND_URL
VITE_ENVIRONMENT=production
```

---

## 📝 CÓMO OBTENER CADA VARIABLE

### DATABASE_URL (PostgreSQL)
1. Crear base de datos en Railway/Render
2. Copiar connection string
3. Formato: `postgresql://user:password@host:port/database`

### JWT_SECRET
1. Generar string aleatorio seguro
2. Mínimo 32 caracteres
3. Puedes usar: `openssl rand -base64 32`

### FRONTEND_URL
1. Lista de URLs separadas por comas
2. Incluir: The Generator, Ghost Studio, cualquier dominio que use el backend
3. Ejemplo: `https://the-generator.son1kvers3.com,https://ghost-studio.vercel.app`

### GROQ_API_KEY
1. Ir a: https://console.groq.com
2. Crear API key
3. Copiar la key

### SUPABASE URLs/KEYS
1. Ir a: https://app.supabase.com
2. Tu proyecto
3. Settings → API
4. Copiar:
   - Project URL → `SUPABASE_URL` o `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY` o `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (solo backend, nunca en frontend público)

### BACKEND_URL
1. Después de deployar backend en Railway/Render
2. Copiar la URL del servicio
3. Ejemplo: `https://super-son1k-backend.railway.app`

---

## ✅ CHECKLIST ANTES DE PEDIR VARIABLES

### Backend:
- [ ] PostgreSQL creado (Railway/Render)
- [ ] DATABASE_URL copiada
- [ ] JWT_SECRET generado
- [ ] FRONTEND_URL lista (con todas las URLs)
- [ ] Backend deployado (para obtener BACKEND_URL)

### Frontend:
- [ ] GROQ_API_KEY obtenida
- [ ] Supabase proyecto creado/verificado
- [ ] SUPABASE URLs/KEYS copiadas
- [ ] BACKEND_URL del backend deployado

---

## 🎯 ORDEN RECOMENDADO

1. **Primero:** Crear PostgreSQL y obtener DATABASE_URL
2. **Segundo:** Generar JWT_SECRET
3. **Tercero:** Deploy backend y obtener BACKEND_URL
4. **Cuarto:** Obtener GROQ_API_KEY
5. **Quinto:** Verificar Supabase y obtener keys
6. **Sexto:** Configurar todo en Vercel

---

## 📋 FORMATO PARA COMPARTIR

Puedes compartir las variables así:

```
BACKEND:
DATABASE_URL=postgresql://...
JWT_SECRET=...
FRONTEND_URL=https://...

THE GENERATOR:
BACKEND_URL=https://...
GROQ_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

GHOST STUDIO:
VITE_BACKEND_URL=https://...
```

O simplemente dime:
- "Tengo PostgreSQL en Railway"
- "Tengo Groq API key"
- "Tengo Supabase proyecto"

Y yo te ayudo a configurar todo. 🚀

