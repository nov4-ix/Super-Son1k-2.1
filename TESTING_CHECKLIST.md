# 🧪 CHECKLIST DE PRUEBAS - BETA LAUNCH

## 📋 Pre-requisitos

- [ ] Backend deployado en Railway/Render (o corriendo local)
- [ ] The Generator deployado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Extensión empaquetada o lista para instalar

---

## ✅ PRUEBA 1: Extensión - Instalación

### Objetivo: Verificar que la extensión se instala correctamente

**Pasos:**
1. Abrir `chrome://extensions/`
2. Activar "Modo desarrollador"
3. Cargar extensión desde carpeta `extensions/suno-extension/`
4. Verificar que aparece como "Son1kVerse AI Music Engine"

**Resultado esperado:**
- ✅ Extensión aparece instalada
- ✅ Nombre correcto (sin mencionar Suno)
- ✅ No hay errores en console del background script

---

## ✅ PRUEBA 2: Extensión - Auto-Extracción

### Objetivo: Verificar que extrae tokens automáticamente

**Pasos:**
1. Abrir pestaña con el sitio objetivo (debe estar logueado)
2. Esperar 3-5 minutos
3. Abrir DevTools → Console del background script
4. Verificar logs: "Token auto-extracted and sent to pool"

**Resultado esperado:**
- ✅ Log muestra extracción exitosa
- ✅ Token aparece en storage local
- ✅ No hay errores

**Verificar en background script console:**
```javascript
// En chrome://extensions/ → Background page → Console
chrome.storage.local.get(['capturedTokens'], (result) => {
  console.log('Tokens:', result.capturedTokens)
})
```

---

## ✅ PRUEBA 3: Extensión - Envío al Pool

### Objetivo: Verificar que tokens se envían al pool

**Pasos:**
1. Verificar que hay token extraído
2. Verificar envío a: `https://the-generator.son1kvers3.com/api/token-pool/add`
3. Verificar respuesta exitosa

**Verificar con curl:**
```bash
curl https://the-generator.son1kvers3.com/api/token-pool/metrics
```

**Resultado esperado:**
- ✅ Token aparece en métricas del pool
- ✅ Pool tiene al menos 1 token activo
- ✅ No hay errores 404/500

---

## ✅ PRUEBA 4: Terms Acceptance Component

### Objetivo: Verificar instalación desde web app

**Pasos:**
1. Abrir The Generator en localhost o Vercel
2. Llegar a pantalla de términos (o crear ruta `/terms`)
3. Click en "Aceptar e Instalar"
4. Verificar que se muestra modal de instalación

**Resultado esperado:**
- ✅ Modal aparece correctamente
- ✅ Botón "Aceptar" funciona
- ✅ Instrucciones de instalación se muestran

---

## ✅ PRUEBA 5: The Generator - Generación Real

### Objetivo: Verificar generación de música con tokens del pool

**Pasos:**
1. Abrir `https://the-generator.son1kvers3.com`
2. Escribir prompt: "electronic dance music, upbeat, 120 BPM"
3. Click "Generate"
4. Esperar 60-120 segundos
5. Verificar que audio se reproduce

**Resultado esperado:**
- ✅ Status muestra "Processing..." → "Completed"
- ✅ Audio player aparece con URL válida
- ✅ Audio se reproduce correctamente
- ✅ No hay errores en consola

**Verificar logs del backend:**
```bash
# En Railway/Render logs
# Debe mostrar:
# - Request a /api/generation/create
# - Token usado del pool
# - Generación completada
```

---

## ✅ PRUEBA 6: Ghost Studio - Cover Generation

### Objetivo: Verificar generación de covers

**Pasos:**
1. Abrir `https://ghost-studio.vercel.app`
2. Upload archivo audio pequeño (5-10 MB)
3. Escribir prompt: "synthwave cover"
4. Click "Generate Cover"
5. Esperar 60-120 segundos
6. Verificar audio resultado

**Resultado esperado:**
- ✅ Upload funciona
- ✅ Generación inicia correctamente
- ✅ Status updates en tiempo real
- ✅ Audio resultado se reproduce

---

## ✅ PRUEBA 7: Pool de Tokens - Rotación

### Objetivo: Verificar que múltiples tokens funcionan

**Pasos:**
1. Agregar 2-3 tokens al pool (manualmente o vía extensión)
2. Hacer 3-5 generaciones rápidas
3. Verificar que se usan diferentes tokens

**Verificar métricas:**
```bash
curl https://the-generator.son1kvers3.com/api/token-pool/metrics
```

**Resultado esperado:**
- ✅ Pool muestra múltiples tokens
- ✅ Tokens rotan correctamente
- ✅ No se agota un solo token

---

## ✅ PRUEBA 8: Backend Health Check

### Objetivo: Verificar que backend responde

**Pasos:**
```bash
curl https://TU_BACKEND_URL.railway.app/health
```

**Resultado esperado:**
```json
{
  "status": "healthy",
  "services": {
    "database": "healthy",
    "tokenManager": "healthy"
  }
}
```

---

## ✅ PRUEBA 9: End-to-End Completo

### Objetivo: Flujo completo desde aceptar términos hasta generar música

**Pasos:**
1. **Usuario nuevo acepta términos:**
   - Modal aparece
   - Click "Aceptar e Instalar"
   - Extensión se instala

2. **Extensión funciona automáticamente:**
   - Usuario visita sitio objetivo
   - Token se extrae (silenciosamente)
   - Token se envía al pool

3. **Usuario genera música:**
   - Abre The Generator
   - Escribe prompt
   - Click Generate
   - Música se genera usando token del pool

**Resultado esperado:**
- ✅ Todo el flujo funciona sin errores
- ✅ Usuario no ve referencias a Suno
- ✅ Música se genera exitosamente

---

## 🐛 Troubleshooting

### Error: "Extension not installed"
- Verificar que extensión está cargada en `chrome://extensions/`
- Verificar permisos en manifest.json

### Error: "No JWT token found"
- Usuario debe estar logueado en el sitio objetivo
- Verificar que cookie `__client` existe

### Error: "Pool API error 404"
- Verificar que endpoint `/api/token-pool/add` existe
- Verificar URL en `background.js` (línea ~172)

### Error: "Generation failed"
- Verificar que hay tokens en el pool
- Verificar que tokens son válidos
- Revisar logs del backend

---

## 📊 Métricas a Revisar

Después de todas las pruebas:

- [ ] Pool tiene mínimo 1 token activo
- [ ] Backend responde /health correctamente
- [ ] Generaciones completan exitosamente
- [ ] No hay errores críticos en logs
- [ ] Tiempo de generación: < 120 segundos

---

**¡Vamos a probar! 🚀**

