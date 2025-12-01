# 👉 EMPIEZA AQUÍ

## 🎯 Tu proyecto está 100% listo para Vercel

### 📋 ¿Qué necesitas?

1. **Token de GitHub Models**
   - Ve a: https://github.com/marketplace/models
   - Crea un Personal Access Token
   - Cópialo (se parece a: `github_pat_11ABC...XYZ`)

2. **Cuenta en Vercel**
   - Regístrate gratis en: https://vercel.com

---

## 🚀 3 Pasos para Desplegar

### 1️⃣ Sube a GitHub
```bash
git init
git add .
git commit -m "Listo para Vercel"
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

### 2️⃣ Despliega en Vercel
1. Ve a https://vercel.com/new
2. Importa tu repositorio
3. En **"Environment Variables"** agrega:
   ```
   GITHUB_TOKEN = [tu_token_aqui]
   ```
4. Click en "Deploy"

### 3️⃣ ¡Prueba!
- Abre tu sitio: `https://tu-proyecto.vercel.app`
- Click en el botón de chat 💬
- Escribe "Hola"
- ¡Listo! ✅

---

## 📖 Guías Completas

- **DEPLOY_VERCEL.md** ← ⚡ Lee esta primero (5 min)
- **VERCEL_DEPLOYMENT.md** ← 📚 Guía detallada
- **INSTRUCCIONES_COMPLETAS.md** ← 📋 Todo explicado

---

## ❓ ¿Dónde pongo mis datos?

**Solo necesitas configurar UNA variable en Vercel:**

```
Key:   GITHUB_TOKEN
Value: [TU_TOKEN_DE_GITHUB_MODELS]
```

**Eso es todo.** El código ya está configurado para usarla automáticamente.

---

## 🎉 ¡5 minutos y tendrás tu sitio en línea!

Cualquier duda, lee **DEPLOY_VERCEL.md**

