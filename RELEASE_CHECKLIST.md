# Launch Checklist – Son1kVerse v1.0

Breve checklist operacional para cada deploy (alineado a las reglas del proyecto).

## 1) Variables de entorno (Vercel)
- [ ] NEXT_PUBLIC_SUPABASE_URL (Preview/Prod)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (Preview/Prod)
- [ ] (Opcional backend) SUPABASE_SERVICE_ROLE, SUPABASE_JWT_SECRET
- [ ] Desactivar logs sensibles en prod

## 2) Calidad y Seguridad
- [ ] `npm run lint` y `npm run type-check` sin errores
- [ ] Dependencias auditadas (npm audit / Snyk si aplica)
- [ ] Sin secretos en el repo (grep keys/.env)
- [ ] No cambios en archivos Suno protegidos (src/config/apiTokens.ts, src/services/sunoService.ts, src/hooks/useSunoService.ts)

## 3) Build y Smoke Tests
- [ ] Build local OK para apps críticas (ej.: apps/the-generator-nextjs, apps/ghost-studio)
- [ ] Smoke test en Preview URL (login, flujo básico)
- [ ] Performance rápido (Lighthouse > 80 en móvil si aplica)

## 4) UX y A11y
- [ ] Responsive en móvil (páginas clave)
- [ ] Estados de carga, vacío y error visibles
- [ ] Accesibilidad básica (roles/labels en componentes nuevos)

## 5) Analítica y Observabilidad
- [ ] Analytics activo (GA/Mixpanel si aplica)
- [ ] Logs de error visibles (Vercel / Sentry si aplica)
- [ ] Health endpoints OK (si existen)

## 6) Legal y Mensajería
- [ ] Disclaimer de copyright presente en contenido generado
- [ ] Sin referencia a credenciales internas o URLs privadas

## 7) Deploy
- [ ] PR aprobado (Squash & Merge recomendado)
- [ ] Deploy en `main` sin errores
- [ ] Verificación post-deploy en producción

## 8) Post-Deploy
- [ ] Crear tag de release (ej.: v1.0.0)
- [ ] Actualizar README y CHANGELOG si aplica
- [ ] Comunicar a equipo/usuarios (anuncio breve)

---

Notas
- Mantener consistencia de diseño (cyberpunk) y no romper archivos protegidos Suno.
- Preferir merges limpios y revertibles.

