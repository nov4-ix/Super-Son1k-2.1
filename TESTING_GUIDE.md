# 🧪 GUÍA DE PRUEBAS PASO A PASO

## 🚀 PRUEBAS RÁPIDAS (5 minutos)

### Prueba 1: Instalar Extensión

1. Abre Chrome → `chrome://extensions/`
2. Activa **"Modo desarrollador"** (toggle arriba derecha)
3. Click **"Cargar extensión sin empaquetar"**
4. Navega a: `/Users/nov4-ix/Downloads/Super-Son1k-2.1-main/extensions/suno-extension`
5. Selecciona la carpeta
6. ✅ Debe aparecer "Son1kVerse AI Music Engine"

**Verificar:**
- [ ] Extensión aparece instalada
- [ ] No hay errores rojos
- [ ] Icon aparece en toolbar

---

### Prueba 2: Verificar Background Script

1. En `chrome://extensions/`, busca "Son1kVerse AI Music Engine"
2. Click en **"service worker"** o **"background page"**
3. Se abre la consola del background script
4. Verifica que no hay errores

**Resultado esperado:**
```
Son1kVerse AI Music Engine initialized
```

---

### Prueba 3: Auto-Extracción (Requiere sitio objetivo)

**⚠️ Esta prueba requiere que estés logueado en el sitio objetivo**

1. Abre una pestaña con el sitio objetivo (debe estar logueado)
2. Abre DevTools → Console del background script
3. Espera 3-5 minutos
4. Debe aparecer: `Token auto-extracted and sent to pool`

**Verificar tokens capturados:**
En la consola del background script:
```javascript
chrome.storage.local.get(['capturedTokens'], (result) => {
  console.log('Tokens capturados:', result.capturedTokens?.length || 0)
  if (result.capturedTokens?.length > 0) {
    console.log('Último token:', result.capturedTokens[result.capturedTokens.length - 1])
  }
})
```

---

### Prueba 4: Verificar Pool (The Generator)

**Opción A: Via curl**
```bash
curl https://the-generator.son1kvers3.com/api/token-pool/metrics
```

**Opción B: Via navegador**
1. Abre `https://the-generator.son1kvers3.com/api/token-pool/metrics`
2. Debe mostrar JSON con métricas del pool

**Resultado esperado:**
```json
{
  "total": 1,
  "active": 1,
  "inactive": 0,
  ...
}
```

---

### Prueba 5: Generación Real

1. Abre `https://the-generator.son1kvers3.com`
2. Escribe prompt: `electronic dance music, upbeat, 120 BPM`
3. Click **"Generate"**
4. Espera 60-120 segundos
5. ✅ Debe aparecer audio player con música

**Verificar:**
- [ ] Status cambia: "Processing..." → "Completed"
- [ ] Audio player aparece
- [ ] Audio se reproduce
- [ ] No hay errores en consola del navegador

---

## 🔍 DEBUGGING

### Si la extensión no extrae tokens:

1. **Verificar que está en el sitio correcto:**
   ```javascript
   // En consola del background script
   chrome.tabs.query({active: true}, (tabs) => {
     console.log('Tab activo:', tabs[0].url)
   })
   ```

2. **Verificar detección de sitio:**
   ```javascript
   // La función isTargetSite busca estos patrones:
   // - 'studio-api.prod'
   // - '/feed/v3'
   // - '/generate/v2'
   ```

3. **Forzar extracción manual:**
   ```javascript
   // En background script console
   chrome.tabs.query({active: true}, async (tabs) => {
     const bg = chrome.runtime.getBackgroundPage()
     // Esto requiere acceso a la instancia del servicio
   })
   ```

### Si tokens no se envían al pool:

1. **Verificar URL del Generator:**
   ```javascript
   // En background script console
   chrome.storage.local.get(['generatorUrl'], (result) => {
     console.log('Generator URL:', result.generatorUrl || 'default: https://the-generator.son1kvers3.com')
   })
   ```

2. **Verificar respuesta del pool:**
   ```javascript
   // En background script, revisa Network tab
   // Debe haber request a: /api/token-pool/add
   ```

---

## ✅ CHECKLIST FINAL

Antes de marcar como "Listo para Beta":

- [ ] Extensión se instala sin errores
- [ ] Background script se inicializa correctamente
- [ ] Auto-extracción funciona (o al menos detecta sitio)
- [ ] Tokens se envían al pool (verificar métricas)
- [ ] The Generator puede generar música real
- [ ] No hay errores críticos en consolas
- [ ] Usuario no ve referencias a Suno

---

**¡Listo para probar! 🎯**

