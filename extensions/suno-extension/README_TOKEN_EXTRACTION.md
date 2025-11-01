# 🔑 Extracción Automática de Tokens en la Extensión

## ✅ Nueva Funcionalidad Agregada

La extensión ahora puede **extraer tokens directamente desde las cookies de Suno.com** y enviarlos automáticamente al pool de The Generator.

---

## 🎯 Cómo Usar

### Método 1: Botón "Extraer y Enviar al Pool" (Más Rápido) ⚡

1. **Abre suno.com** en tu navegador (debes estar logueado)
2. **Click en el icono de la extensión** (Super-Son1k Token Capture)
3. **Click en el botón:** `🔑 Extraer y Enviar al Pool`
4. ✅ Listo! El token se extrae de las cookies, se guarda localmente y se envía automáticamente al pool

**¿Qué hace?**
- Extrae el JWT token de la cookie `__client` de Suno.com
- Lo guarda en el almacenamiento local de la extensión
- Lo envía automáticamente al pool de The Generator (`https://son1kgenerator-iex2vyt3s-son1kvers3s-projects-c805d053.vercel.app/api/token-pool/add`)

---

### Método 2: Enviar Token Ya Capturado

Si ya tienes tokens capturados en la extensión:

1. Abre el popup de la extensión
2. Click en `📤 Enviar al Pool`
3. Se envía el token más reciente al pool

---

## 🔧 Configuración

### URL del Generator

Por defecto usa: `https://son1kgenerator-iex2vyt3s-son1kvers3s-projects-c805d053.vercel.app`

Para cambiar la URL:

1. Abre la extensión
2. En DevTools → Console del background script:
```javascript
chrome.storage.local.set({ generatorUrl: 'TU_URL_AQUI' })
```

---

## 📋 Flujo Completo

```
1. Usuario está en suno.com (logueado)
   ↓
2. Click en extensión → "Extraer y Enviar al Pool"
   ↓
3. Extensión lee cookie __client
   ↓
4. Token se guarda localmente
   ↓
5. Token se envía a: https://the-generator.son1kvers3.com/api/token-pool/add
   ↓
6. ✅ Token disponible en The Generator para generación
```

---

## ⚠️ Requisitos

1. **Debes estar logueado en suno.com**
2. **Debes estar en la página de suno.com** (no funciona desde otras páginas)
3. **La extensión debe tener permisos** de cookies (ya configurados en manifest.json)

---

## 🐛 Troubleshooting

### Error: "Not on Suno.com"
- **Solución:** Abre una pestaña con suno.com y vuelve a intentar

### Error: "No JWT token found in cookies"
- **Solución:** Asegúrate de estar logueado en suno.com
- Recarga la página y vuelve a intentar

### Error: "Pool API error"
- **Solución:** Verifica que `https://the-generator.son1kvers3.com` esté accesible
- Verifica que el endpoint `/api/token-pool/add` exista

### Token no aparece en The Generator
- **Solución:** Verifica que el token se envió correctamente:
  - Abre DevTools → Console del background script
  - Verifica logs: "Token sent to pool successfully"

---

## 🚀 Ventajas vs Script Manual

### Antes (Script Manual):
1. Abrir suno.com
2. Ejecutar bookmarklet/script
3. Copiar token
4. Ejecutar Python script
5. Pegar token
6. Enviar

**Total: 6 pasos, ~2 minutos**

### Ahora (Extensión):
1. Abrir suno.com
2. Click en extensión → "Extraer y Enviar al Pool"

**Total: 2 pasos, ~10 segundos** ⚡

---

## 📝 Notas Técnicas

- El token se extrae de la cookie `__client`
- Se valida que sea un JWT válido antes de enviar
- Se guarda localmente con metadata (timestamp, URL, deviceId)
- Se envía con label: `extension-{timestamp}`

---

**¡Ya no necesitas scripts manuales! La extensión lo hace todo automáticamente.** 🎉

