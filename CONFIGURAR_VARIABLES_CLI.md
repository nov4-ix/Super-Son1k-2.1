# 🚀 Configurar Variables Railway desde Terminal

## ✅ Sí, puedes hacerlo desde la terminal!

La sintaxis correcta del Railway CLI es:
```bash
railway variables --set "KEY=value"
```

---

## 🎯 Script Automatizado

He creado un script que configura todas las variables automáticamente:

```bash
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main

# Cargar nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Ejecutar script
./scripts/configurar-variables-railway-cli.sh
```

**Qué hace el script:**
- ✅ Lee todas las variables de `env.backend.REAL`
- ✅ Salta variables que Railway crea automáticamente (`DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`)
- ✅ Salta variables con placeholders (`REEMPLAZA...`)
- ✅ Configura todas las demás variables usando `railway variables --set`

---

## 🔧 Configuración Manual (Si prefieres)

Si quieres configurar variables una por una:

```bash
# Cargar nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Verificar que estés linkeado
railway link  # Si no está linkeado

# Configurar variables
railway variables --set "JWT_EXPIRES_IN=7d"
railway variables --set "SUPABASE_URL=https://swbnenfucupmtpihmmht.supabase.co"
railway variables --set "SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# ... etc
```

---

## 📋 Variables que el Script Configurará

El script configurará estas 18 variables:

1. `JWT_EXPIRES_IN=7d`
2. `SUPABASE_URL=https://swbnenfucupmtpihmmht.supabase.co`
3. `SUPABASE_SERVICE_ROLE_KEY=...`
4. `SUPABASE_ANON_KEY=...`
5. `SUNO_API_URL=https://api.suno.ai/v1`
6. `SUNO_API_KEY=OPCIONAL_USA_TOKEN_POOL`
7. `STRIPE_SECRET_KEY=...`
8. `STRIPE_PUBLISHABLE_KEY=...`
9. `FRONTEND_URL=https://ghost-studio.son1kvers3.com,https://the-generator.son1kvers3.com`
10. `PORT=3001`
11. `HOST=0.0.0.0`
12. `NODE_ENV=production`
13. `LOG_LEVEL=info`
14. `MIN_TOKENS=20`
15. `MAX_TOKENS=500`
16. `ROTATION_INTERVAL=180000`
17. `HEALTH_CHECK_INTERVAL=30000`

**Variables que NO configurará** (Railway las crea automáticamente):
- `DATABASE_URL` (se crea con PostgreSQL)
- `REDIS_URL` (se crea con Redis)
- `JWT_SECRET` (se genera automáticamente)

---

## ⚠️ Notas Importantes

1. **Debes estar linkeado al proyecto:**
   ```bash
   railway link
   ```

2. **Verifica que PostgreSQL y Redis estén conectados:**
   - Railway Dashboard → Verifica que existan servicios PostgreSQL y Redis
   - Si no existen, agrégalos desde el dashboard

3. **Después de configurar variables:**
   - Railway hará auto-deploy si está conectado a GitHub
   - O puedes hacer deploy manual desde el dashboard

---

## 🚀 Orden Completo de Deploy

```bash
# 1. Cargar nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# 2. Linkear proyecto (si no está linkeado)
railway link

# 3. Configurar variables
./scripts/configurar-variables-railway-cli.sh

# 4. Verificar en dashboard que las variables estén configuradas

# 5. Deploy (desde dashboard o GitHub)
# Railway hará auto-deploy si está conectado a GitHub
```

---

## ✅ Checklist

- [ ] Railway CLI instalado (`npm install -g @railway/cli`)
- [ ] Autenticado (`railway login`)
- [ ] Proyecto linkeado (`railway link`)
- [ ] PostgreSQL y Redis conectados en Railway Dashboard
- [ ] Variables configuradas (script o manual)
- [ ] Deploy completado
- [ ] Migraciones Prisma ejecutadas

---

**¡Ejecuta el script y listo!** 🚀

