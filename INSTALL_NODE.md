# 📦 Instalar Node.js/npm en macOS

## 🚀 Opción 1: Homebrew (Recomendado)

```bash
# Instalar Homebrew (si no lo tienes)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js (incluye npm)
brew install node

# Verificar instalación
node --version
npm --version
```

---

## 🚀 Opción 2: NVM (Node Version Manager)

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Cargar nvm en la sesión actual
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instalar Node.js LTS
nvm install --lts
nvm use --lts

# Verificar
node --version
npm --version
```

---

## 🚀 Opción 3: Descargar Instalador Oficial

1. Ve a: https://nodejs.org/
2. Descarga el instalador `.pkg` para macOS
3. Ejecuta el instalador
4. Reinicia la terminal
5. Verifica: `node --version`

---

## ✅ Después de Instalar

```bash
cd /Users/nov4-ix/Downloads/Super-Son1k-2.1-main/apps/the-generator-nextjs
npm install
```

---

## 💡 Alternativa: Deploy Directo desde Vercel

Si no quieres instalar Node.js localmente:

1. **Ve a:** https://vercel.com/dashboard
2. **Selecciona proyecto:** `son1kgenerator`
3. **Settings → General:**
   - Root Directory: `apps/the-generator-nextjs`
4. **Deploy → Create Deployment**
5. **O simplemente push a GitHub** (si está configurado auto-deploy)

Vercel instalará las dependencias automáticamente durante el build.

---

**¿Cuál método prefieres?** 🎯

