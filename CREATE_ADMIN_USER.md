# 👤 Crear Usuario Administrador

## Paso 1: Crear usuario en Supabase Auth

1. **Ir a Supabase Dashboard**: https://supabase.com/dashboard/project/swbnenfucupmtpihmmht/auth/users

2. **Click en "Add user" o "Invite user"**

3. **Llenar los datos**:
   ```
   Email: tu-email@gmail.com (o el email que quieras usar como admin)
   Password: [tu contraseña]
   Auto Confirm User: ✅ (marcar esta opción)
   ```

4. **Click en "Create user"**

5. **Copiar el ID del usuario** que se creó (algo como: `a1b2c3d4-e5f6-...`)

## Paso 2: Agregar a la tabla Users en Prisma Studio

1. **Abrir**: http://localhost:5555

2. **Click en tabla "User"** (en el menú izquierdo)

3. **Click en "+" o "Add record"**

4. **Llenar estos campos**:
   ```
   id: [EL ID QUE COPARTISTE DEL PASO 1]
   email: tu-email@gmail.com
   username: admin
   tier: ENTERPRISE
   isAdmin: true (marcar esta casilla)
   alvaeEnabled: false
   ```

5. **Click en "Save 1 change"**

## Paso 3: Crear Tier para el Admin

1. **Click en tabla "UserTier"** (en el menú izquierdo)

2. **Click en "+" o "Add record"**

3. **Llenar estos campos**:
   ```
   id: [auto-generado]
   userId: [EL MISMO ID DEL USUARIO]
   tier: ENTERPRISE
   monthlyGenerations: 9999
   dailyGenerations: 999
   maxDuration: 600
   quality: premium
   features: all
   ```

4. **Click en "Save 1 change"**

## ✅ Listo!

Ahora puedes:
- Iniciar sesión en http://localhost:3002 con el email y contraseña que creaste
- Generar música ilimitada
- Tener acceso admin

## Alternativa: Login con Google

Si prefieres usar Google:

1. Crear usuario en tabla `User`:
   ```
   id: [ID de Supabase - lo obtienes después de autenticarte con Google]
   email: tu-email@gmail.com
   username: tu-nombre
   tier: ENTERPRISE
   isAdmin: true
   ```

2. Autenticarte con Google en la app
3. El sistema automáticamente te dará tier ENTERPRISE

---

**Nota**: Es más fácil primero autenticarte con Google y luego agregar el registro en la base de datos.
