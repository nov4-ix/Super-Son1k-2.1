# 🧪 Pruebas Después del Deployment

## ✅ Deployment Listo

Una vez que el deployment complete en Vercel, sigue estas pruebas:

---

## 🧪 PRUEBA 1: Verificar Deployment

### URL: `https://the-generator.son1kvers3.com`

1. Abre en navegador
2. Debe cargar la app de Next.js (no 404)
3. Sin errores en consola del navegador

---

## 🧪 PRUEBA 2: Verificar Pool de Tokens

```bash
curl https://the-generator.son1kvers3.com/api/token-pool/metrics
```

**Debe responder JSON:**
```json
{
  "total": 0,
  "active": 0,
  ...
}
```

**Si responde 404:** El endpoint no existe aún (puede ser normal si no está implementado)

---

## 🧪 PRUEBA 3: Instalar Extensión

1. Chrome → `chrome://extensions/`
2. Modo desarrollador ON
3. Cargar desde: `/Users/nov4-ix/Downloads/Super-Son1k-2.1-main/extensions/suno-extension`
4. Verificar: "Son1kVerse AI Music Engine" aparece

---

## 🧪 PRUEBA 4: Extension - Verificar URL

En background script console (`chrome://extensions/` → service worker):

```javascript
chrome.storage.local.get(['generatorUrl'], (result) => {
  console.log('URL configurada:', result.generatorUrl || 'default: https://the-generator.son1kvers3.com')
})
```

**Debe mostrar:** `https://the-generator.son1kvers3.com`

---

## 🧪 PRUEBA 5: Auto-Extracción (Requiere sitio objetivo)

1. Abre pestaña con sitio objetivo (logueado)
2. Espera 3-5 minutos
3. Background script console debe mostrar: `Token auto-extracted and sent to pool`

---

## 🧪 PRUEBA 6: Generación Real

1. Abre: `https://the-generator.son1kvers3.com`
2. Escribe prompt: `electronic dance music, upbeat`
3. Click "Generate"
4. Espera 60-120 segundos
5. ✅ Audio debe reproducirse

---

## 📋 Checklist Rápido

- [ ] Deployment completó exitosamente
- [ ] URL funciona: `the-generator.son1kvers3.com`
- [ ] Extensión instalada correctamente
- [ ] Pool endpoint responde (o 404 si no está implementado)
- [ ] Listo para pruebas de generación

---

**Espera a que el deployment complete, luego ejecuta estas pruebas.** 🚀

