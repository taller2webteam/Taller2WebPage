# ⚡ Quick Start - Deployment Rápido

## 🎯 Objetivo
Subir tu proyecto a Vercel en **5 minutos**.

---

## ✅ Pre-requisitos

- [ ] Cuenta en [GitHub](https://github.com)
- [ ] Cuenta en [Vercel](https://vercel.com)
- [ ] Token de GitHub Models (el que ya tienes)

---

## 🚀 Pasos Rápidos

### 1️⃣ Subir a GitHub (2 minutos)

```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit (ahora SIN el token hardcodeado)
git commit -m "Deploy to Vercel"

# Crear repositorio en GitHub y conectar
# Ve a github.com → New Repository → Copia la URL

git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

✅ **¡Listo! Tu código está en GitHub sin el token expuesto.**

---

### 2️⃣ Deploy en Vercel (3 minutos)

1. **Ir a Vercel:**
   - Abre [vercel.com/new](https://vercel.com/new)
   - Login con GitHub

2. **Importar Proyecto:**
   - Click en "Import Git Repository"
   - Selecciona tu repositorio
   - Click en "Import"

3. **Configurar Variable de Entorno:**
   - En la pantalla de configuración, ve a "Environment Variables"
   - Agrega:
     ```
     Name:  GITHUB_TOKEN
     Value: TU_TOKEN_DE_GITHUB_MODELS_AQUI
     ```
   - Selecciona: Production, Preview, Development

4. **Deploy:**
   - Click en "Deploy"
   - Espera 1-2 minutos
   - ¡Listo! 🎉

---

## 🌐 Tu Sitio Está en Línea

Vercel te dará una URL como:
```
https://tu-proyecto.vercel.app
```

---

## 🧪 Verificar que Funciona

1. Abre tu sitio en Vercel
2. Click en el botón de chat (esquina inferior derecha)
3. Escribe "Hola"
4. Si el asistente responde → **¡Todo funciona!** ✅

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

Vercel hará **deploy automático** en segundos. 🚀

---

## 🐛 Si Algo Sale Mal

### El chat no responde

**Solución:**
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Verifica que `GITHUB_TOKEN` esté configurado
4. Si no está, agrégala y redeploy

### Error al hacer push a GitHub

**Solución:**
```bash
# Verificar que .gitignore existe
cat .gitignore

# Si no existe, créalo
echo ".env" > .gitignore
echo ".vercel" >> .gitignore

# Intentar push de nuevo
git add .
git commit -m "Fix gitignore"
git push
```

---

## 📱 Comandos Útiles

```bash
# Ver estado de git
git status

# Ver logs de Vercel (requiere CLI)
vercel logs

# Abrir proyecto en Vercel
vercel open

# Ver variables de entorno
vercel env ls
```

---

## 🎯 Checklist Final

- [ ] Código subido a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Variable `GITHUB_TOKEN` configurada
- [ ] Deploy exitoso
- [ ] Chat funcionando
- [ ] Filtros funcionando
- [ ] Todas las páginas accesibles

---

## 🎉 ¡Felicidades!

Tu proyecto está en línea y funcionando. Comparte tu URL:

```
https://tu-proyecto.vercel.app
```

---

## 📚 Más Información

- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Guía detallada
- [README.md](README.md) - Documentación completa
- [Vercel Docs](https://vercel.com/docs)

---

**Tiempo total: ~5 minutos** ⚡

