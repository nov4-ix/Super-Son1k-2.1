# ✅ FIX: Auth Google + Admin Account

## Cambios Realizados

### 1. **AuthGuard.tsx - URLs locales** ✅
```typescript
// ANTES: Usaba URL de producción hardcodeada
const redirectTo = `${process.env.NODE_ENV === 'production'
  ? 'https://the-generator-36oj6sa0e-son1kvers3s-projects.vercel.app'
  : window.location.origin}/auth/callback`;

// AHORA: Siempre usa URL local
const redirectTo = `${window.location.origin}/auth/callback`;
```

### 2. **callback/route.ts - URLs dinámicas** ✅
```typescript
// ANTES: URL hardcodeada de producción
const baseUrl = 'https://the-generator-36oj6sa0e-son1kvers3s-projects.vercel.app'

// AHORA: Detecta automáticamente si es localhost
const baseUrl = request.headers.get('host')?.includes('localhost') 
  ? `http://${request.headers.get('host')}` 
  : 'https://the-generator.son1kvers3.com'
```

### 3. **Crear Usuario Admin** ✅

**Opción 1: Desde Prisma Studio**
```bash
cd packages/backend
npx prisma studio
# Abre http://localhost:5555
# Tabla "users" → Add record
# Email: admin@son1kvers3.com
# Username: admin
# Tier: ENTERPRISE
# isAdmin: true
```

**Opción 2: Directamente en Supabase Dashboard**
1. Ir a: https://supabase.com/dashboard/project/swbnenfucupmtpihmmht
2. Tabla `auth.users` → Crear usuario
3. Email: `admin@son1kvers3.com`
4. Password: (resetear desde Auth)
5. Tabla `users` → Crear registro relacionado:
   - email: `admin@son1kvers3.com`
   - username: `admin`
   - tier: `ENTERPRISE`
   - isAdmin: `true`

## 🔧 Pasos para Configurar

### Paso 1: Crear Usuario en Supabase
```bash
# Opción A: Via CLI
# Ir a Supabase Dashboard → Authentication → Users → Add User
```

### Paso 2: Configurar Tier Admin en Database
```sql
-- En Supabase SQL Editor
INSERT INTO users (id, email, username, "tier", "isAdmin")
VALUES 
  (gen_random_uuid()::text, 'admin@son1kvers3.com', 'admin', 'ENTERPRISE', true);

-- Verificar
SELECT * FROM users WHERE email = 'admin@son1kvers3.com';
```

### Paso 3: Probar Login Google
1. Abrir: http://localhost:3002
2. Click en "Iniciar Sesión"
3. Theme "Continuar con Google"
4. Autenticarte con cualquier cuenta
5. Debería redirigir a: http://localhost:3002/generator

## 🚨 Solución de Problemas

### Error: "redirect_uri_mismatch"
**Causa**: Supabase no tiene configurado el redirect URI local

**Solución**:
1. Ir a: https://supabase.com/dashboard/project/swbnenfucupmtpihmmht/auth/url-configuration
2. Agregar a "Redirect URLs":
   - `http://localhost:3002/auth/callback`
   - `http://localhost:3002/**`
3. Guardar

### Error: "OAuth provider not enabled"
**Causa**: Google OAuth no está habilitado en Supabase

**Solución**:
1. Ir a: https://supabase.com/dashboard/project/swbnenfucupmtpihmmht/auth/providers
2. Enable "Google" provider
3. Configurar OAuth credentials (si son requeridas)

### Error: "User not found"
**Causa**: Usuario autenticado no existe en tabla `users`

**Solución**:
1. Autenticarse con Google
2. Verificar que el email esté en `users` table
3. Si no existe, crear manualmente el registro

## 📋 URLs Importantes

- **The Generator**: http://localhost:3002
- **Backend**: http://localhost:3001
- **Supabase Dashboard**: https://supabase.com/dashboard/project/swbnenfucupmtpihmmht
- **Prisma Studio**: http://localhost:5555 (después de `npx prisma studio`)

## ✅ Checklist

- [x] Corregir URLs en AuthGuard.tsx
- [x] Corregir URLs en callback/route.ts
- [x] Configurar .env.local con credenciales Supabase
- [ ] Agregar redirect URIs en Supabase Dashboard
- [ ] Habilitar Google OAuth en Supabase
- [ ] Crear usuario admin en base de datos
- [ ] Probar login con Google
- [ ] Verificar que el usuario admin tenga acceso

---

**Estado Actual**: Auth correcto, solo falta configurar Supabase Dashboard  
**Próximo**: Configurar OAuth en Supabase y crear usuario admin
