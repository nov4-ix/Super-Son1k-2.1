# ⚡ QUICK FIX: Configurar URL Correcta

## 🚨 Problema Actual

```
404: DEPLOYMENT_NOT_FOUND
the-generator.son1kvers3.com
```

---

## ✅ SOLUCIÓN (2 minutos)

### Paso 1: Obtener URL Real de Vercel

1. Ve a: https://vercel.com/dashboard
2. Busca proyecto: `the-generator` o `the-generator-nextjs`
3. Click en el proyecto
4. En **Overview**, copia la URL del deployment:
   - Ejemplo: `https://the-generator-abc123xyz.vercel.app`
   - O: `https://the-generator.vercel.app` (si tiene dominio configurado)

### Paso 2: Configurar en Extensión

**Opción A: Desde Console (Rápido)**

1. Instala la extensión en Chrome
2. Ve a `chrome://extensions/`
3. Busca "Son1kVerse AI Music Engine"
4. Click en **"service worker"** o **"background page"**
5. En la consola, pega:

```javascript
chrome.storage.local.set({ 
  generatorUrl: 'https://TU-URL-REAL.vercel.app' 
}, () => {
  console.log('✅ URL configurada!')
})
```

6. ✅ Listo! La extensión ahora usa tu URL real.

---

**Opción B: Modificar Código (Permanente)**

Edita `extensions/suno-extension/background.js` línea 233:

```javascript
// Cambiar esto:
const generatorUrl = result.generatorUrl || 'https://YOUR-VERCEL-URL.vercel.app'

// Por esto (con tu URL real):
const generatorUrl = result.generatorUrl || 'https://the-generator-abc123.vercel.app'
```

---

## 🧪 Verificar que Funciona

### Test 1: Verificar URL Configurada

En background script console:
```javascript
chrome.storage.local.get(['generatorUrl'], (result) => {
  console.log('URL configurada:', result.generatorUrl || 'No configurada (usará default)')
})
```

### Test 2: Verificar Pool

```bash
curl https://TU-URL-REAL.vercel.app/api/token-pool/metrics
```

Debe responder JSON con métricas (no 404).

---

## 📝 También Actualizar en Scripts

Si usas `scripts/add_token_to_pool.py`:

```bash
python3 scripts/add_token_to_pool.py --token "TU_TOKEN" --url "https://TU-URL-REAL.vercel.app"
```

---

**Dime tu URL de Vercel y actualizo todo automáticamente!** 🚀

