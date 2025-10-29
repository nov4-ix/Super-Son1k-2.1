# 📊 Tablas en Prisma Studio - Explicación

## Tabla: Token ✅ IMPORTANTE AHORA

**Para qué sirve**: Guardar tokens de la API de Suno

**Campos a llenar**:
```
hash: token1
encryptedToken: [TOKEN DE SUNO]
email: soypepejaim.es@gmail.com
isActive: true
isValid: true
tier: FREE
```

**Cuándo usarla**: AHORA, para poder generar música

---

## Tabla: User

**Para qué sirve**: Usuarios de la plataforma

**Campos a llenar** (si creas un admin):
```
email: tu-email@gmail.com
username: admin
tier: ENTERPRISE
isAdmin: true
```

**Cuándo usarla**: Para crear cuenta de administrador

---

## Tabla: UserTier

**Para qué sirve**: Definir límites de generación para cada usuario

**Campos ejemplo**:
```
userId: [ID del usuario]
tier: ENTERPRISE
monthlyGenerations: 9999
dailyGenerations: 999
maxDuration: 600
```

**Cuándo usarla**: Solo si creas un usuario desde cero manualmente

**Nota**: Si autenticas con Google, esto se crea automáticamente

---

## 🎯 AHORA SOLO NECESITAS:

1. ✅ Tabla "Token" → Agregar el token de Suno
2. ✅ Listo para generar música

Las demás tablas son opcionales/para después.

