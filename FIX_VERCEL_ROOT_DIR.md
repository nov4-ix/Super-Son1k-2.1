# 🔧 FIX: Root Directory No Existe

## 🚨 Error

```
The specified Root Directory "apps/the-generator-nextjs" does not exist.
Please update your Project Settings.
```

---

## ✅ SOLUCIONES

### Opción 1: Root Directory Vacío (Si proyecto apunta al repo completo)

Si el proyecto de Vercel está linkeado al **repositorio completo** (`Super-Son1k-2.1-main`):

1. Ve a: https://vercel.com/dashboard
2. Selecciona proyecto: `son1kgenerator`
3. **Settings → General → Root Directory**
4. **DEJA VACÍO** (o pon `./`)
5. **Build Command:** `cd apps/the-generator-nextjs && npm install && npm run build`
6. **Output Directory:** `apps/the-generator-nextjs/.next`
7. **Install Command:** `cd apps/the-generator-nextjs && npm install`

---

### Opción 2: Crear Proyecto Separado (Recomendado)

Si tienes un proyecto que apunta solo a `the-generator-nextjs`:

1. Ve a: https://vercel.com/dashboard
2. **Add New Project**
3. Importa desde GitHub/GitLab
4. Selecciona el repositorio: `Super-Son1k-2.1-main`
5. **Root Directory:** `apps/the-generator-nextjs`
6. **Framework Preset:** Next.js
7. Deploy

---

### Opción 3: Verificar Estructura Real

**Si el proyecto ya existe y tiene estructura diferente:**

1. Ve a **Settings → General**
2. Mira qué **Root Directory** tiene actualmente
3. Verifica si el proyecto apunta a:
   - Repo completo (raíz)
   - Subdirectorio específico
   - Otro repositorio

---

## 🎯 Configuración Recomendada

### Si proyecto apunta a REPO COMPLETO:

```
Root Directory: (vacío)
Build Command: cd apps/the-generator-nextjs && npm install && npm run build
Output Directory: apps/the-generator-nextjs/.next
Install Command: cd apps/the-generator-nextjs && npm install
```

### Si proyecto apunta SOLO A the-generator-nextjs:

```
Root Directory: apps/the-generator-nextjs
Build Command: (vacío - auto)
Output Directory: (vacío - auto)
Install Command: (vacío - auto)
```

---

## 🔍 Cómo Verificar

1. Ve a: https://vercel.com/dashboard
2. Selecciona proyecto
3. **Deployments → Ver último deployment**
4. Click en el deployment
5. Ve a **Build Logs**
6. Mira el primer comando que ejecuta - ahí verás desde dónde está corriendo

**Ejemplo:**
- Si dice: `cd /vercel/path0/apps/the-generator-nextjs` → Necesitas Root Directory
- Si dice: `cd /vercel/path0` → No necesitas Root Directory, usa Build Command personalizado

---

**¿Qué Root Directory tiene configurado actualmente?** Así te doy la solución exacta.

