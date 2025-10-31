# 🎵 Cómo Agregar Token de Suno

## Token de Suno API
```
eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yT1o2eU1EZzhscWRKRWloMXJvemY4T3ptZG4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJzdW5vLWFwaSIsImF6cCI6Imh0dHBzOi8vc3Vuby5jb20iLCJleHAiOjE3NjE1MzU1MjAsImZ2YSI6WzEyNDc0LC0xXSwiaHR0cHM6Ly9zdW5vLmFpL2NsYWltcy9jbGVya19pZCI6InVzZXJfMnFwWkhYdVNOU2tLdmVBaGtmekVTMTRkZ1RIIiwiaHR0cHM6Ly9zdW5vLmFpL2NsYWltcy9lbWFpbCI6InNveXBlcGVqYWltZXNAZ21haWwuY29tIiwiaHR0cHM6Ly9zdW5vLmFpL2NsYWltcy9waG9uZSI6bnVsbCwiaWF0IjoxNzYxNTMxOTIwLCJpc3MiOiJodHRwczovL2NsZXJrLnN1bm8uY29tIiwianRpIjoiZTFiOGNhNTlmM2VkZjYxNjIyYTEiLCJuYmYiOjE3NjE1MzE5MTAsInNpZCI6InNlc3NfMzRFZjNGMm5WbXlzeEI1b1M3aUlPeEh6eVRnIiwic3RzIjoiYWN0aXZlIiwic3ViIjoidXNlcl8ycXBaSFh1U05Ta0t2ZUFoa2Z6RVMxNGRnVEgifQ.HPOmQvN2c4ZV87gYJlt2i_07ewDMYrZgwVfRztqsFO9E2jNBFy1Ybespv75FTu4gOLyBMdPuxqPl0R5rWGt-ZCYNj_aeMwuV4SWOpLPmImpBFaOGaeotuQzaRtcpCbmPkff8rh2dbARVPRuYYy_xcODeSxsTckRlrSdiPzeqTG8otAHxh35PG1bXVh6DXRnSViHedMezDgatx-fKHAxxGp6zM8yU4TVMSrxMoAETg5IF1JXSpQEiPgFe4PfkS2sHvpuO6lIgWiRT_R7EjeI-w8pqjTG54K6geN76trcnpAN7LEY5uEvfhDHsh0kQjbAur77VA27ao69T1pNLzBkABg
```

Email asociado: `soypepejaim.es@gmail.com`

## Método 1: Usando Prisma Studio (MÁS FÁCIL)

1. **Abrir Prisma Studio**:
   ```bash
   cd packages/backend
   npx prisma studio
   ```
   O usa el que ya está corriendo: http://localhost:5555

2. **Ir a la tabla `Token`**

3. **Click en "Add record" o "+"**

4. **Llenar los campos**:
   ```
   id: (auto-generado)
   hash: "suno-token-" + timestamp (ej: suno-token-1761528000)
   email: "soypepejaim.es@gmail.com"
   isActive: true
   isValid: true
   usageCount: 0
   rateLimit: 10
   tier: "FREE"
   metadata: "{\"source\":\"manual\",\"added_by\":\"admin\"}"
   encryptedToken: [PEGAR EL TOKEN COMPLETO AQUÍ]
   expiresAt: [Fecha en 30 días: 2025-02-25]
   createdAt: [Hoy]
   updatedAt: [Hoy]
   ```

5. **Click "Save 1 change"**

6. **Verificar**: El backend debería reconocer el token inmediatamente

## Método 2: Usando SQL Directo

```sql
INSERT INTO tokens (
  hash, 
  email, 
  "isActive", 
  "isValid", 
  "usageCount", 
  "rateLimit", 
  tier, 
  "metadata", 
  "encryptedToken", 
  "createdAt", 
  "updatedAt"
) VALUES (
  'suno-token-' || extract(epoch from now()),
  'soypepejaim.es@gmail.com',
  true,
  true,
  0,
  10,
  'FREE',
  '{"source":"manual","added_by":"admin"}'::jsonb,
  'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yT1o2eU1EZzhscWRKRWloMXJvemY4T3ptZG4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJzdW5vLWFwaSIsImF6cCI6Imh0dHBzOi8vc3Vuby5jb20iLCJleHAiOjE3NjE1MzU1MjAsImZ2YSI6WzEyNDc0LC0xXSwiaHR0cHM6Ly9zdW5vLmFpL2NsYWltcy9jbGVya19pZCI6InVzZXJfMnFwWkhYdVNOU2tLdmVBaGtmekVTMTRkZ1RIIiwiaHR0cHM6Ly9zdW5vLmFpL2NsYWltcy9lbWFpbCI6InNveXBlcGVqYWltZXNAZ21haWwuY29tIiwiaHR0cHM6Ly9zdW5也可以lL2NsYWltcy9waG9uZSI6bnVsbCwiaWF0IjoxNzYxNTMxOTIwLCJpc3MiOiJodHRwczovL2NsZXJrLnN1bm8uY29tIiwianRpIjoiZTFiOGNhNTlmM2VkZjYxNjIyYTEiLCJuYmYiOjE3NjE1MzE5MTAsInNpZCI6InNlc3NfMzRFZjNGMm5WbXlzeEI1b1M3aUlPeEh6eVRnIiwic3RzIjoiYWN0aXZlIiwic3ViIjoidXNlcl8ycXBaSFh1U05Ta0t2ZUFoa2Z6RVMxNGRnVEgifQ.HPOmQvN2c4ZV87gYJlt2i_07ewDMYrZgwVfRztqsFO9E2jNBFy1Ybespv75FTu4gOLyBMdPuxqPl0R5rWGt-ZCYNj_aeMwuV4SWOpLPmImpBFaOGaeotuQzaRtcpCbmPkff8rh2dbARVPRuYYy_xcODeSxsTckRlrSdiPzeqTG8otAHxh35PG1bXVh6DXRnSViHedMezDgatx-fKHAxxGp6zM8yU4TVMSrxMoAETg5IF1JXSpQEiPgFe4PfkS2sHvpuO6lIgWiRT_R7EjeI-w8pqjTG54K6geN76trcnpAN7LEY5uEvfhDHsh0kQjbAur77VA27ao69T1pNLzBkABg',
  now(),
  now()
);
```

## Método 3: Via API del Backend

```bash
curl -X POST http://localhost:3001/api/tokens \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJSUzI1NiIs...",
    "email": "soypepejaim.es@gmail.com",
    "tier": "FREE"
  }'
```

## Verificar que funcionó

Después de agregar el token:

1. **Revisar logs del backend**:
   ```bash
   # Verás algo como:
   "Token pool initialized with 1 tokens (1 healthy)"
   ```

2. **Probar generación de música**:
   - Abrir: http://localhost:3002/generator
   - Autenticarte
   - Generar música
   - Debería funcionar ✅

## Estado Actual

- ✅ Prisma Studio: http://localhost:5555
- ✅ The Generator: http://localhost:3002
- ✅ Backend: http://localhost:3001
- ⏳ Token: Necesita agregarse

---

**PASO SIGUIENTE**: Abre Prisma Studio en http://localhost:5555 y agrega el token manualmente.
