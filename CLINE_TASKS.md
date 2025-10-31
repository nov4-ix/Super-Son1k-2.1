# 🤖 TAREAS PARA CLINE - BETA LAUNCH PREP

**Fecha:** Oct 31, 2025  
**Objetivo:** Preparar apps para beta launch HOY  
**Prioridad:** ⚡ CRÍTICO - Completar sin romper nada

---

## 🚨 REGLAS CRÍTICAS (LEER PRIMERO)

### ❌ NUNCA MODIFICAR:
- `src/services/sunoService.ts`
- `src/config/apiTokens.ts`
- `src/hooks/useSunoService.ts`
- Endpoints de Suno API
- Headers de Suno API

### ✅ SÍ PUEDES:
- Modificar frontend apps (The Generator, Ghost Studio, Nova Post Pilot)
- Crear componentes UI
- Actualizar README/docs
- Configurar envs
- Fix errores de consola menores
- Agregar scripts

---

## 📋 TAREA 1: README - Sección "Beta Live"

### Objetivo:
Agregar sección al README.md raíz con links a apps en producción.

### Pasos:
1. Abrir `/Users/nov4-ix/Downloads/Super-Son1k-2.1-main/README.md`
2. Buscar sección "## 🚀 Applications" o similar
3. Agregar nueva sección ANTES o DESPUÉS:

```markdown
## 🎉 BETA LIVE (October 2025)

### Applications Now Live:

- **🌐 Landing Page** - [Visit Landing](https://son1kverse.vercel.app)
- **📱 Nova Post Pilot** - [Visit App](https://nova-post-pilot.vercel.app) - Marketing Intelligence Platform
- **🎵 The Generator** - [Visit App](https://the-generator.vercel.app) - AI Music Generation
- **🎛️ Ghost Studio** - [Visit App](https://ghost-studio.vercel.app) - AI Music Covers & Mini DAW

### Status:
- ✅ Auth system functional
- ✅ Music generation with real Suno API
- ✅ Responsive design
- 🔄 Backend deployment in progress

**Note:** This is a beta release. Some features may be limited.
```

4. Guardar y verificar que markdown renderiza correctamente

**Aceptación:**
- [ ] README tiene sección "Beta Live"
- [ ] URLs son correctas (verificar en Vercel si es necesario)
- [ ] Markdown renderiza bien
- [ ] No rompió formato existente

---

## 📋 TAREA 2: Env URLs - Leer desde Variables

### Objetivo:
Reemplazar hardcoded `localhost` por variables de entorno.

### Pasos:

#### 2.1 The Generator Next.js

**Archivo:** `apps/the-generator-nextjs/app/api/generate-music/route.ts`

**Línea ~149:** Cambiar:
```typescript
// ❌ ANTES:
let response = await fetch('http://localhost:3001/api/generation/create', {

// ✅ DESPUÉS:
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
let response = await fetch(`${BACKEND_URL}/api/generation/create`, {
```

**Verificar:**
- [ ] Usa `process.env.BACKEND_URL` o `NEXT_PUBLIC_BACKEND_URL`
- [ ] Fallback a localhost solo para dev
- [ ] Funciona en producción cuando env está configurada

#### 2.2 Ghost Studio

**Archivo:** `apps/ghost-studio/src/components/BackendGenerateButton.tsx`

**Línea ~8:** Cambiar:
```typescript
// ❌ ANTES:
const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:4000';

// ✅ DESPUÉS:
const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  'http://localhost:4000';
```

**Verificar:**
- [ ] Lee de `VITE_BACKEND_URL` correctamente
- [ ] Fallback a localhost para dev

#### 2.3 Crear .env.example en Ghost Studio

**Archivo:** `apps/ghost-studio/.env.example` (crear si no existe)

```env
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_SUNO_API_KEY=your-suno-api-key
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Aceptación:**
- [ ] The Generator lee BACKEND_URL de env
- [ ] Ghost Studio lee VITE_BACKEND_URL de env
- [ ] .env.example creado en Ghost Studio
- [ ] No hardcode localhost en producción

---

## 📋 TAREA 3: Shared UI - Componentes Mínimos

### Objetivo:
Crear 3 componentes base en `packages/shared-ui` con glassmorphism.

### Pasos:

#### 3.1 Estructura de Carpetas

```bash
packages/shared-ui/
├── src/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── index.ts
├── package.json (ya existe)
└── tsconfig.json (ya existe)
```

#### 3.2 Button.tsx

**Crear:** `packages/shared-ui/src/Button.tsx`

```typescript
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white hover:opacity-90',
    secondary: 'bg-[#00FFE7] text-[#0a0a0f] hover:bg-[#00FFE7]/90',
    ghost: 'bg-white/5 text-white border border-white/10 hover:bg-white/10 backdrop-blur-xl'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
```

#### 3.3 Input.tsx

**Crear:** `packages/shared-ui/src/Input.tsx`

```typescript
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-[#e0e0e0] mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 
          bg-white/5 border border-white/10 
          rounded-lg text-white placeholder-gray-500
          backdrop-blur-xl
          focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]
          transition-all duration-300
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
```

#### 3.4 Card.tsx

**Crear:** `packages/shared-ui/src/Card.tsx`

```typescript
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  glow?: boolean;
}

export function Card({
  title,
  glow = false,
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-white/5 border border-white/10 
        rounded-xl p-6
        backdrop-blur-xl
        hover:bg-white/10 transition-all duration-300
        ${glow ? 'shadow-[0_0_20px_rgba(0,255,231,0.3)]' : ''}
        ${className}
      `}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
```

#### 3.5 index.ts

**Crear/Actualizar:** `packages/shared-ui/src/index.ts`

```typescript
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Card, type CardProps } from './Card';
```

#### 3.6 Actualizar package.json

**Verificar:** `packages/shared-ui/package.json` tiene:
```json
{
  "name": "@super-son1k/shared-ui",
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

**Aceptación:**
- [ ] Button.tsx creado con variants y glassmorphism
- [ ] Input.tsx creado con label/error states
- [ ] Card.tsx creado con glow option
- [ ] index.ts exporta todos
- [ ] Se puede importar desde apps: `import { Button } from '@super-son1k/shared-ui'`
- [ ] Build funciona: `cd packages/shared-ui && npm run build` (si tiene script)

---

## 📋 TAREA 4: Smoke Tests Scripts

### Objetivo:
Crear scripts npm para pruebas manuales rápidas.

### Pasos:

#### 4.1 Actualizar package.json root

**Archivo:** `/Users/nov4-ix/Downloads/Super-Son1k-2.1-main/package.json`

**Agregar scripts:**
```json
{
  "scripts": {
    // ... scripts existentes ...
    "smoke:generator": "echo '🧪 TEST: The Generator\\n1. Abre https://the-generator.vercel.app\\n2. Escribe prompt musical\\n3. Click Generate\\n4. Espera 60-120s\\n5. Verifica audio se reproduce ✅'",
    "smoke:ghost": "echo '🧪 TEST: Ghost Studio\\n1. Abre https://ghost-studio.vercel.app\\n2. Upload audio file\\n3. Escribe prompt cover\\n4. Click Generate Cover\\n5. Espera 60-120s\\n6. Verifica audio se reproduce ✅'",
    "smoke:nova": "echo '🧪 TEST: Nova Post Pilot\\n1. Abre https://nova-post-pilot.vercel.app\\n2. Login/Signup\\n3. Verifica dashboard carga\\n4. Navega entre secciones ✅'"
  }
}
```

**Aceptación:**
- [ ] Scripts agregados al package.json
- [ ] `npm run smoke:generator` imprime instrucciones
- [ ] `npm run smoke:ghost` imprime instrucciones
- [ ] `npm run smoke:nova` imprime instrucciones

---

## 📋 TAREA 5: Console Errors - Quick Fixes

### Objetivo:
Abrir cada app, verificar errores de consola, fix menores.

### Pasos:

1. **Abrir The Generator en localhost o Vercel preview**
2. **Abrir DevTools Console**
3. **Capturar errores:**
   - Import errors
   - TypeScript errors visibles
   - Undefined variables
   - Missing props

4. **Fix solo:**
   - Import paths incorrectos
   - Typos en nombres de variables
   - Props faltantes simples
   - No modificar lógica de generación

5. **Repetir para:**
   - Ghost Studio
   - Nova Post Pilot
   - Landing (si existe)

**Aceptación:**
- [ ] The Generator: 0 errores críticos en consola
- [ ] Ghost Studio: 0 errores críticos en consola
- [ ] Nova Post Pilot: 0 errores críticos en consola
- [ ] No se rompió funcionalidad existente

---

## ✅ CHECKLIST FINAL PARA CLINE

Antes de marcar como completado:

- [ ] Tarea 1: README actualizado con sección Beta Live
- [ ] Tarea 2: Envs configurados en apps (no hardcode localhost)
- [ ] Tarea 3: Shared UI componentes creados y funcionando
- [ ] Tarea 4: Scripts smoke tests agregados
- [ ] Tarea 5: Console errors menores corregidos
- [ ] NO se modificó código de Suno protegido
- [ ] NO se rompió funcionalidad existente
- [ ] Builds funcionan: `npm run build` en cada app

---

## 📝 NOTAS PARA CLINE

1. **Si encuentras errores graves:** Documentar en comentarios, NO fix sin confirmar
2. **Si algo no está claro:** Preguntar antes de modificar
3. **Priorizar:** Envs > README > Shared UI > Scripts > Console fixes
4. **Testing:** Después de cada cambio, verificar que app carga sin errores

---

**¡Éxito! 🚀**

