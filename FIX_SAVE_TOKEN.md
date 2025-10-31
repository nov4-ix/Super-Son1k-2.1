# 🔧 Solución: No me deja guardar en Prisma Studio

## Causas Comunes

### 1. Campo requerido vacío
Todos estos campos son **obligatorios**:
- `hash` ⚠️
- `isActive` ⚠️
- `isValid` ⚠️

### 2. Formato incorrecto
- `isActive` y `isValid` deben ser: **true** o **false** (no texto)
- `tier` debe ser uno de: FREE, PRO, PREMIUM, ENTERPRISE

## Solución Paso a Paso

### Método 1: Llenar campos mínimos primero

1. **Solo llena estos campos**:
   ```
   hash: token1
   isActive: true
   isValid: true
   ```

2. **Click en "Save 1 change"**

3. **Si guarda OK**, edita ese registro y agrega:
   ```
   email: soypepejaim.es@gmail.com
   tier: FREE
   encryptedToken: [EL TOKEN LARGO]
   ```

### Método 2: Usar SQL directo

Si Prisma Studio falla, usa SQL directamente:

```sql
INSERT INTO tokens (
  hash, 
  "isActive", 
  "isValid",
  "encryptedToken",
  email,
  tier,
  "usageCount",
  "rateLimit",
  metadata
) VALUES (
  'token1',
  true,
  true,
  'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yT1o2eU1EZzhscWRKRWloMXJvemY4T3ptZG4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJzdW5vLWFwaSIsImF6cCI6Imh0dHBzOi8vc3Vuby5jb20iLCJleHAiOjE3NjE1MzU1MjAsImZ2YSI6WzEyNDc0LC0xXSwiaHR0cHM6Ly9zdW5vLmFpL2NsYWltcy9jbGVya19pZCI6InVzZXJfMnFwWkhYdVNOU2tLdmVBaGtmekVTMTRkZ1RIIiwiaHR0cHM6Ly9zdW5vLmFpL2NsYWltcy9lbWFpbCI6InNveXBlcGVqYWltZXNAZ21haWwuY29tIiwiaHR0cHM6Ly9zdW5vLmFpL2NsYWltcy9waG9uZSI6bnVsbCwiaWF0IjoxNzYxNTMxOTIwLCJpc3MiOiJodHRwczovL2NsZXJrLnN1bm8uY29tIiwianRpIjoiZTFiOGNhNTlmM2VkZjYxNjIyYTEiLCJuYmYiOjE3NjE1MzE5MTAsInNpZCI6InNlc3NfMzRFZjNGMm5WbXlzeEI1b1M3aUlPeEh6eVRnIiwic3RzIjoiYWN0aXZlIiwic3ViIjoidXNlcl8ycXBaSFh1U05Ta0t2ZUFoa2Z6RVMxNGRnVEgifQ.HPOmQvN2c4ZV87gYJlt2i_07ewDMYrZgwVfRztqsFO9E2jNBFy1Ybespv75FTu4gOLyBMdPuxqPl0R5rWGt-ZCYNj_aeMwuV4SWOpLPmImpBFaOGaeotuQzaRtcpCbmPkff8rh2dbARVPRuYYy_xcODeSxsTckRlrSdiPzeqTG8otAHxh35PG1bXVh6DXRnSViHedMezDgatx-fKHAxxGp6zM8yU4TVMSrxMoAETg5IF1JXSpQEiPgFe4PfkS2sHvpuO6lIgWiRT_R7EjeI-w8pqjTG54K6geN76trcnpAN7LEY5uEvfhDHsh0kQjbAur77VA27ao69T1pNLzBkABg',
  'soypepejaim.es@gmail.com',
  'FREE',
  0,
  10,
  '{}'
);
```

### Método 3: Agregar solo lo esencial

**Campos MÍNIMOS requeridos**:
```
hash: token1
isActive: true
isValid: true
```

Todo lo demás es opcional. Guárdalo con esos 3 campos, luego edita.

## ¿Qué mensaje de error te aparece?

Si ves un error específico, dímelo y te ayudo a arreglarlo.

