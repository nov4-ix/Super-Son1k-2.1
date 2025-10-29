# 🏗️ THE GENERATOR - DIAGRAMAS DE ARQUITECTURA

> Diagramas visuales de la arquitectura, flujos y componentes de The Generator

---

## 📊 ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SON1KVERS3 ECOSYSTEM                                 │
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │     Nova     │  │    Ghost     │  │      The     │  │  Sanctuary   │  │
│  │ Post Pilot   │  │   Studio     │  │  Generator   │  │    Social    │  │
│  └──────────────┘  └──────────────┘  └──────┬───────┘  └──────────────┘  │
│                                               │                              │
└───────────────────────────────────────────────┼──────────────────────────────┘
                                                │
                    ┌───────────────────────────▼───────────────────────────┐
                    │         THE GENERATOR - ARQUITECTURA                  │
                    │                                                        │
                    │  ┌──────────────────────────────────────────────┐    │
                    │  │           FRONTEND (Next.js 14)               │    │
                    │  │                                               │    │
                    │  │  ┌────────────┐  ┌────────────┐             │    │
                    │  │  │ Generator  │  │   Lyrics   │             │    │
                    │  │  │   Form     │  │  Display   │             │    │
                    │  │  └─────┬──────┘  └─────┬──────┘             │    │
                    │  │        │                │                    │    │
                    │  │        │   ┌────────────┴──────────────┐    │    │
                    │  │        └──▶│   Audio Player (2 tracks) │    │    │
                    │  │            └───────────────────────────┘    │    │
                    │  └────────────────────┬─────────────────────────┘    │
                    │                       │                              │
                    │                       ▼                              │
                    │  ┌──────────────────────────────────────────────┐   │
                    │  │         API ROUTES (Backend)                  │   │
                    │  │                                               │   │
                    │  │  ┌──────────────┐  ┌──────────────┐         │   │
                    │  │  │   generate   │  │    track     │         │   │
                    │  │  │    -music    │  │   -status    │         │   │
                    │  │  └──────┬───────┘  └──────┬───────┘         │   │
                    │  │         │                  │                 │   │
                    │  │  ┌──────┴───────┐  ┌──────┴───────┐         │   │
                    │  │  │   generate   │  │     pool     │         │   │
                    │  │  │   -lyrics    │  │  management  │         │   │
                    │  │  └──────────────┘  └──────┬───────┘         │   │
                    │  └──────────────────────────┼──────────────────┘   │
                    │                             │                       │
                    │  ┌──────────────────────────▼──────────────────┐   │
                    │  │       UNIFIED TOKEN POOL (Core)              │   │
                    │  │                                              │   │
                    │  │  • Round-robin rotation                     │   │
                    │  │  • Auto-verification (30 min)               │   │
                    │  │  • Auto-cleanup (1 hour)                    │   │
                    │  │  • Auto-sync with DB (5 min)                │   │
                    │  └──────────────────────┬───────────────────────┘   │
                    │                         │                           │
                    └─────────────────────────┼───────────────────────────┘
                                              │
                    ┌─────────────────────────┴───────────────────────────┐
                    │                                                      │
         ┌──────────▼──────────┐              ┌──────────────────────┐   │
         │  SUPABASE POSTGRES  │              │     EXTERNAL APIs     │   │
         │                     │              │                       │   │
         │ • suno_auth_tokens  │              │ • Suno API (music)   │   │
         │ • credit_trans...   │              │ • Groq API (lyrics)  │   │
         │ • token_usage_...   │              │                       │   │
         └─────────────────────┘              └───────────────────────┘   │
                    │                                                      │
         ┌──────────▼──────────┐                                          │
         │  CHROME EXTENSION   │                                          │
         │                     │                                          │
         │ • Auto-capture      │──────────────────────────────────────────┘
         │ • Auto-signup       │              (contributes tokens)
         └─────────────────────┘
```

---

## 🔄 FLUJO DE GENERACIÓN DE MÚSICA

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MUSIC GENERATION FLOW                                 │
└─────────────────────────────────────────────────────────────────────────┘

   👤 USER
    │
    │ 1. Escribe letra y estilo
    │
    ▼
┌─────────────────────────────────┐
│  FRONTEND (generator/page.tsx)  │
│                                 │
│  • Prompt: "Letra en español"  │
│  • Lyrics: "indie rock"         │
│  • Voice: "male"                │
│  • Instrumental: false          │
└────────────┬────────────────────┘
             │
             │ 2. POST /api/generate-music
             │
             ▼
┌─────────────────────────────────────────┐
│  API ROUTE (generate-music/route.ts)   │
└─────────────────────────────────────────┘
             │
             │ 3. Obtener token del pool
             │
             ▼
┌─────────────────────────────────────────┐
│   UNIFIED TOKEN POOL                    │
│                                         │
│   const token = await pool.getToken()  │
│                                         │
│   Tokens: [T1, T2, T3, T4, T5]        │
│             ↑                           │
│        currentIndex                     │
└─────────────┬───────────────────────────┘
             │
             │ 4. Token obtenido: T2
             │
             ▼
┌─────────────────────────────────────────┐
│  GROQ API (Llama 3.1)                  │
│                                         │
│  Traducir estilo a inglés              │
│  "indie rock" → "indie rock, upbeat"   │
└─────────────┬───────────────────────────┘
             │
             │ 5. Estilo traducido
             │
             ▼
┌─────────────────────────────────────────┐
│  CONSTRUIR PAYLOAD                      │
│                                         │
│  {                                      │
│    prompt: "[indie rock]\n\n{letra}",  │
│    lyrics: "",                          │
│    customMode: true,                    │
│    instrumental: false,                 │
│    gender: "male"                       │
│  }                                      │
└─────────────┬───────────────────────────┘
             │
             │ 6. POST https://ai.imgkits.com/suno/generate
             │    Authorization: Bearer {token}
             │
             ▼
┌─────────────────────────────────────────┐
│  SUNO API                               │
│                                         │
│  • Recibe payload                       │
│  • Inicia generación                    │
│  • Retorna taskId                       │
└─────────────┬───────────────────────────┘
             │
             │ 7. Response: { task_id: "002f83u49" }
             │
             ▼
┌─────────────────────────────────────────┐
│  API ROUTE                              │
│                                         │
│  if (response.status === 401) {        │
│    // Token inválido, auto-rotar       │
│    newToken = await pool.markInvalid() │
│    // Reintentar con nuevo token       │
│  }                                      │
└─────────────┬───────────────────────────┘
             │
             │ 8. Return { trackId: "002f83u49" }
             │
             ▼
┌─────────────────────────────────────────┐
│  FRONTEND                               │
│                                         │
│  • Recibe trackId                       │
│  • Inicia polling optimizado            │
└─────────────┬───────────────────────────┘
             │
             │ 9. POLLING LOOP (intervalos progresivos)
             │
             ▼
     ┌───────────────────┐
     │ Attempt 1 (2s)    │─────┐
     └───────────────────┘     │
             │                  │
             ▼                  │
     ┌───────────────────┐     │
     │ Attempt 2 (2s)    │     │
     └───────────────────┘     │
             │                  │
             ▼                  │
     ┌───────────────────┐     │
     │ Attempt 5 (3s)    │     │ GET /api/track-status?trackId=xxx
     └───────────────────┘     │
             │                  │
             ▼                  │
     ┌───────────────────┐     │
     │ Attempt 10 (5s)   │     │
     └───────────────────┘     │
             │                  │
             ▼                  │
     ┌───────────────────┐     │
     │ Attempt 15 (10s)  │─────┘
     └───────────────────┘
             │
             │ 10. GET https://usa.imgkits.com/node-api/suno/
             │     get_mj_status/{taskId}
             │
             ▼
┌─────────────────────────────────────────┐
│  SUNO STATUS API                        │
│                                         │
│  {                                      │
│    code: 200,                           │
│    data: {                              │
│      callbackType: "complete",          │
│      data: [{                           │
│        id: "3b228...",                  │
│        audio_url: "..."                 │
│      }]                                 │
│    }                                    │
│  }                                      │
└─────────────┬───────────────────────────┘
             │
             │ 11. callbackType === "complete"
             │
             ▼
┌─────────────────────────────────────────┐
│  API ROUTE (track-status)               │
│                                         │
│  • Construir URL:                       │
│    https://cdn1.suno.ai/{clipId}.mp3  │
│  • Return { audioUrl, status: "complete" } │
└─────────────┬───────────────────────────┘
             │
             │ 12. Response con audioUrl
             │
             ▼
┌─────────────────────────────────────────┐
│  FRONTEND                               │
│                                         │
│  • Stop polling                         │
│  • setAudioUrl(data.audioUrl)          │
│  • Show audio player                    │
└─────────────┬───────────────────────────┘
             │
             ▼
        ┌─────────┐
        │ 🎵 PLAY │
        └─────────┘
```

---

## 🔑 TOKEN POOL - ROTACIÓN ROUND-ROBIN

```
┌─────────────────────────────────────────────────────────────┐
│              UNIFIED TOKEN POOL - ROUND ROBIN                │
└─────────────────────────────────────────────────────────────┘

Estado Inicial:
┌─────┬─────┬─────┬─────┬─────┐
│ T1  │ T2  │ T3  │ T4  │ T5  │  tokens = [T1, T2, T3, T4, T5]
└─────┴─────┴─────┴─────┴─────┘
  ↑                               currentIndex = 0
  │


Request #1: getToken()
┌─────┬─────┬─────┬─────┬─────┐
│[T1] │ T2  │ T3  │ T4  │ T5  │  ✅ Retorna T1
└─────┴─────┴─────┴─────┴─────┘  currentIndex = 1
        ↑


Request #2: getToken()
┌─────┬─────┬─────┬─────┬─────┐
│ T1  │[T2] │ T3  │ T4  │ T5  │  ✅ Retorna T2
└─────┴─────┴─────┴─────┴─────┘  currentIndex = 2
              ↑


Request #3: getToken()
┌─────┬─────┬─────┬─────┬─────┐
│ T1  │ T2  │[T3] │ T4  │ T5  │  ✅ Retorna T3
└─────┴─────┴─────┴─────┴─────┘  currentIndex = 3
                    ↑


Request #4: getToken()
┌─────┬─────┬─────┬─────┬─────┐
│ T1  │ T2  │ T3  │[T4] │ T5  │  ✅ Retorna T4
└─────┴─────┴─────┴─────┴─────┘  currentIndex = 4
                          ↑


Request #5: getToken()
┌─────┬─────┬─────┬─────┬─────┐
│ T1  │ T2  │ T3  │ T4  │[T5] │  ✅ Retorna T5
└─────┴─────┴─────┴─────┴─────┘  currentIndex = 0 (vuelve al inicio)
                                ↑


Request #6: getToken()
┌─────┬─────┬─────┬─────┬─────┐
│[T1] │ T2  │ T3  │ T4  │ T5  │  ✅ Retorna T1 (ciclo completo)
└─────┴─────┴─────┴─────┴─────┘  currentIndex = 1
  ↑

BENEFICIOS:
• Distribuye carga entre todos los tokens
• Evita agotar un solo token
• Reduce detección por Suno
• Maximiza uptime
```

---

## ⚡ POLLING OPTIMIZADO

```
┌─────────────────────────────────────────────────────────────┐
│           POLLING OPTIMIZATION - PROGRESSIVE INTERVALS       │
└─────────────────────────────────────────────────────────────┘

Antes (LENTO):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Intervalo fijo: 2 segundos
Total checks: ~150 (en 5 minutos)
Tiempo máximo: 300 segundos

│││││││││││││││││││││││││││││││││││││││││││││││││││││││││││││
0s   30s   60s   90s   120s  150s  180s  210s  240s  270s  300s


Después (OPTIMIZADO):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Intervalos progresivos: 2s → 3s → 5s → 10s
Total checks: ~28 (en 3 minutos)
Tiempo máximo: 180 segundos

│││││ ││││  │││   ││    │     │      │       │        │
0s 10s  30s   60s    90s    120s     150s      180s
 ↑    ↑     ↑      ↑       ↑        ↑         ↑
2s   3s    5s    10s     10s      10s       10s

LÓGICA:
const getNextInterval = (elapsed: number): number => {
  if (elapsed < 10000) return 2000  // 0-10s: cada 2s (rápido)
  if (elapsed < 30000) return 3000  // 10-30s: cada 3s
  if (elapsed < 60000) return 5000  // 30-60s: cada 5s
  return 10000                       // 60s+: cada 10s (espaciado)
}

MEJORAS:
• 81% menos requests (150 → 28)
• 40% más rápido (300s → 180s max)
• Menor carga en servidor
• Mejor experiencia de usuario
```

---

## 🎤 GENERACIÓN DE LETRAS

```
┌─────────────────────────────────────────────────────────────┐
│            LYRICS GENERATION - OPTIMIZATION FLOW             │
└─────────────────────────────────────────────────────────────┘

Input del usuario:
┌─────────────────────────────────┐
│ "Una canción de amor triste"   │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│  GROQ API (Llama 3.1)                                   │
│                                                          │
│  Prompt:                                                │
│  "Crea letra basada en: {input}                        │
│   ⚠️ CRÍTICO: LÍNEAS CORTAS (6-8 palabras máximo)"    │
│                                                          │
│  Ejemplos:                                              │
│  ✅ "El viento sopla fuerte hoy" (6 palabras)         │
│  ❌ "El viento sopla tan fuerte que..." (10+ palabras) │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│  RESPUESTA DE IA                                        │
│                                                          │
│  [Verse 1]                                              │
│  Tus palabras se desvanecen                            │
│  Como el humo en el viento                             │
│  Ya no siento tu calor                                 │
│  Solo el frío de tu adiós                              │
│                                                          │
│  [Chorus]                                               │
│  Te extraño cada día                                   │
│  No puedo olvidarte así                                │
│  ...                                                    │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│  VALIDACIÓN POST-GENERACIÓN                             │
│                                                          │
│  lyrics.split('\n').map(line => {                      │
│    const words = line.trim().split(/\s+/)              │
│                                                          │
│    if (words.length > 10) {                            │
│      // ✂️ Dividir en chunks de 8 palabras           │
│      return chunks.join('\n')                          │
│    }                                                    │
│                                                          │
│    return line                                          │
│  })                                                     │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│  LETRA FINAL OPTIMIZADA                                 │
│                                                          │
│  ✅ Todas las líneas ≤ 8 palabras                      │
│  ✅ Cantables en 2-3 segundos                          │
│  ✅ Respiración natural                                │
└─────────────────────────────────────────────────────────┘

COMPARACIÓN:

❌ ANTES (líneas largas):
┌────────────────────────────────────────────────────────┐
│ "El viento sopla tan fuerte que me lleva lejos de    │
│  aquí y no sé si volveré algún día"                   │
│  ^                                                     │
│  └─ 15 palabras - IMPOSIBLE de cantar cómodamente    │
└────────────────────────────────────────────────────────┘

✅ DESPUÉS (líneas cortas):
┌────────────────────────────────────────────────────────┐
│ "El viento sopla tan fuerte"     (6 palabras) ✅      │
│ "Me lleva lejos de aquí"         (5 palabras) ✅      │
│ "No sé si volveré"                (4 palabras) ✅      │
│  ^                                                     │
│  └─ Cantable, con pausas naturales                    │
└────────────────────────────────────────────────────────┘
```

---

## 🔐 EXTENSIÓN CHROME

```
┌─────────────────────────────────────────────────────────────┐
│           CHROME EXTENSION - AUTO CAPTURE FLOW               │
└─────────────────────────────────────────────────────────────┘

1. INSTALACIÓN
   │
   │ Usuario instala extensión
   │
   ▼
┌─────────────────────────────┐
│  background.js              │
│                             │
│  chrome.runtime.onInstalled │
└──────────────┬──────────────┘
               │
               ▼
2. AUTO-SIGNUP EN SUNO
┌─────────────────────────────────────────┐
│  Abrir suno.com/signup (background tab) │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  content-suno.js inyectado              │
│                                         │
│  • Detecta formulario signup            │
│  • Auto-completa campos                 │
│  • Submit formulario                    │
└──────────────┬──────────────────────────┘
               │
               ▼
3. CAPTURA DE TOKEN
┌─────────────────────────────────────────┐
│  Interceptar Network Request            │
│                                         │
│  fetch('*://clerk.suno.com/*')         │
│  → Extraer JWT del response             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  content-suno.js                        │
│                                         │
│  window.postMessage({                   │
│    type: 'SUNO_TOKEN_CAPTURED',        │
│    token: jwt                           │
│  })                                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  background.js                          │
│                                         │
│  chrome.runtime.onMessage()            │
│  • Recibe token                         │
│  • Guarda en chrome.storage.local      │
└──────────────┬──────────────────────────┘
               │
               ▼
4. ENVÍO AL POOL
┌─────────────────────────────────────────┐
│  POST /api/community/auto-capture       │
│                                         │
│  {                                      │
│    token: jwt,                          │
│    source: 'extension'                  │
│  }                                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Token agregado al pool ✅              │
│                                         │
│  • Usuario recibe +50 créditos          │
│  • Token disponible para comunidad      │
└─────────────────────────────────────────┘
```

---

## 📊 BASE DE DATOS - SCHEMA

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  suno_auth_tokens                                             │
├───────────────┬──────────────────────────────────────────────┤
│ id            │ UUID PRIMARY KEY                              │
│ token         │ TEXT UNIQUE (JWT)                             │
│ issuer        │ TEXT (issuer del JWT)                         │
│ expires_at    │ TIMESTAMPTZ                                   │
│ is_active     │ BOOLEAN (✅/❌)                               │
│ usage_count   │ INTEGER (cuántas veces usado)                 │
│ health_status │ TEXT ('healthy'/'degraded'/'expired')        │
│ source        │ TEXT ('manual'/'api'/'extension')            │
│ owner_user_id │ UUID FK → auth.users                         │
│ is_community  │ BOOLEAN                                       │
│ created_at    │ TIMESTAMPTZ                                   │
└───────────────┴──────────────────────────────────────────────┘
                              │
                              │ FK
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  credit_transactions                                          │
├───────────────┬──────────────────────────────────────────────┤
│ id            │ UUID PRIMARY KEY                              │
│ user_id       │ UUID FK → auth.users                         │
│ amount        │ INTEGER (+50 ganó, -10 gastó)                │
│ type          │ TEXT ('contribution'/'generation'/...)       │
│ description   │ TEXT                                          │
│ related_token │ UUID FK → suno_auth_tokens                   │
│ created_at    │ TIMESTAMPTZ                                   │
└───────────────┴──────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  token_usage_analytics                                        │
├───────────────┬──────────────────────────────────────────────┤
│ id            │ UUID PRIMARY KEY                              │
│ user_id       │ UUID FK → auth.users                         │
│ token_used    │ TEXT (primeros 20 chars)                     │
│ action        │ TEXT ('generation'/'polling')                │
│ success       │ BOOLEAN                                       │
│ error_message │ TEXT                                          │
│ timestamp     │ TIMESTAMPTZ                                   │
└───────────────┴──────────────────────────────────────────────┘

FUNCIONES PL/pgSQL:
┌──────────────────────────────────────┐
│  get_user_balance(user_id)          │ → INTEGER (créditos)
│  consume_credits(user_id, amount)   │ → JSONB (success/error)
│  grant_credits(user_id, amount)     │ → JSONB (success)
│  get_community_stats()               │ → JSONB (pool stats)
└──────────────────────────────────────┘

VISTAS:
┌──────────────────────────────────────┐
│  contributor_leaderboard             │
│  • Top contribuyentes                 │
│  • Tokens activos por usuario         │
│  • Balance de créditos                │
└──────────────────────────────────────┘
```

---

**Última actualización**: Octubre 2024  
**Ver también**: `DEVELOPER_GUIDE.md`, `QUICK_REFERENCE.md`

