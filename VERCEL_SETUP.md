# 🚀 Vercel Setup - The Generator

## 📋 Obtener URL del Deployment

### Método 1: Dashboard Web (Más Fácil)

1. **Ve a:** https://vercel.com/dashboard
2. **Busca proyecto:** `the-generator` o `the-generator-nextjs`
3. **Click en el proyecto**
4. **En "Overview":** Verás la URL del deployment
   - Ejemplo: `https://the-generator-abc123xyz.vercel.app`
   - O: `https://the-generator.vercel.app` (si tiene dominio)

5. **Copia esa URL completa** (incluye `https://`)

---

### Método 2: Vercel CLI

```bash
# Si tienes Vercel CLI instalado
cd apps/the-generator-nextjs
vercel ls                    # Lista todos los proyectos
vercel inspect               # Info del proyecto actual
vercel domains ls            # Lista dominios configurados
```

---

### Método 3: Script Automático

```bash
./get-vercel-url.sh
```

---

## 🔧 Configurar URL en Extensión

Una vez tengas la URL:

### Opción A: Desde Console (Más Rápido)

1. Instala extensión en Chrome
2. Ve a `chrome://extensions/`
3. Busca "Son1kVerse AI Music Engine"
4. Click en **"service worker"**
5. En consola, pega:

```javascript
chrome.storage.local.set({ 
  generatorUrl: 'https://TU-URL-REAL.vercel.app' 
}, () => {
  console.log('✅ URL configurada:', 'https://TU-URL-REAL.vercel.app')
})
```

### Opción B: Modificar Código

Edita: `extensions/suno-extension/background.js` línea 236:

```javascript
const generatorUrl = result.generatorUrl || 'https://TU-URL-REAL.vercel.app'
```

---

## ✅ Verificar que Funciona

```bash
# Reemplaza TU-URL con tu URL real
curl https://TU-URL.vercel.app/api/token-pool/metrics
```

**Debe responder JSON, no 404.**

---

## 🎯 URLs Comunes en Vercel

- **Production:** `https://PROJECT-NAME.vercel.app`
- **Con dominio:** `https://tu-dominio.com`
- **Preview:** `https://PROJECT-NAME-git-BRANCH-USER.vercel.app`

---

**¿Tienes la URL? Pégala aquí y actualizo todo automáticamente!** 🚀

