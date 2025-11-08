# 📁 Ubicaciones de Archivos .env REALES

## 🎯 Rutas Completas

### Para Vercel (Ghost Studio)
```
/Users/nov4-ix/Downloads/Super-Son1k-2.1-main/env.ghost-studio.REAL
```

### Para Vercel (The Generator)
```
/Users/nov4-ix/Downloads/Super-Son1k-2.1-main/env.the-generator.REAL
```

### Para Railway (Backend)
```
/Users/nov4-ix/Downloads/Super-Son1k-2.1-main/env.backend.REAL
```

---

## 🚀 Cómo Cargar en Vercel

### Opción 1: Desde Vercel Dashboard (Recomendado)

1. **Ve a Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto (Ghost Studio o The Generator)

2. **Ve a Settings → Environment Variables**

3. **Copia y pega las variables:**
   - Abre el archivo `.REAL` correspondiente
   - Copia cada variable (línea por línea)
   - Pega en Vercel Dashboard

### Opción 2: Desde Vercel CLI

```bash
# Ghost Studio
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main/apps/ghost-studio
vercel env pull .env.local
# Edita .env.local con los valores de env.ghost-studio.REAL
vercel env push .env.local

# The Generator
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main/apps/the-generator-nextjs
vercel env pull .env.local
# Edita .env.local con los valores de env.the-generator.REAL
vercel env push .env.local
```

### Opción 3: Importar desde Archivo (Vercel CLI)

```bash
# Ghost Studio
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main/apps/ghost-studio
vercel env add VITE_SUPABASE_URL production < ../env.ghost-studio.REAL

# The Generator
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main/apps/the-generator-nextjs
vercel env add NEXT_PUBLIC_SUPABASE_URL production < ../env.the-generator.REAL
```

---

## 📋 Contenido de los Archivos

### env.ghost-studio.REAL
Contiene:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL`
- `VITE_ENVIRONMENT`
- `VITE_BACKEND_URL` (requiere URL de Railway después del deploy)

### env.the-generator.REAL
Contiene:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GROQ_API_KEY`
- `VITE_APP_URL`
- `VITE_ENVIRONMENT`
- `NEXT_PUBLIC_BACKEND_URL` (requiere URL de Railway después del deploy)
- `BACKEND_URL` (requiere URL de Railway después del deploy)

---

## ⚠️ Importante

1. **Variables con valores placeholder:**
   - `VITE_BACKEND_URL=https://TU_BACKEND_RAILWAY.railway.app`
   - `NEXT_PUBLIC_BACKEND_URL=https://TU_BACKEND_RAILWAY.railway.app`
   
   **Actualiza estas** con la URL real de Railway después del deploy del backend.

2. **Selecciona "Production"** para todas las variables en Vercel.

3. **Después de agregar variables**, haz un redeploy para que se apliquen.

---

## 🎯 Orden Recomendado

1. **Deploy Backend en Railway primero**
2. **Copia la URL del backend de Railway**
3. **Carga variables en Vercel** (usando los archivos .REAL)
4. **Actualiza `VITE_BACKEND_URL` y `NEXT_PUBLIC_BACKEND_URL`** con la URL de Railway
5. **Deploy en Vercel**

---

**Archivos listos en: `/Users/nov4-ix/Downloads/Super-Son1k-2.1-main/`** 📁

