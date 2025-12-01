# 🚀 Deployment Rápido a Vercel

## ⚡ Paso a Paso (5 minutos)

### 1️⃣ Obtén tu Token de GitHub Models

1. Ve a https://github.com/marketplace/models
2. Haz clic en "Get started" 
3. Ve a https://github.com/settings/tokens
4. Crea un "Personal Access Token (classic)"
5. **NO selecciones ningún permiso** (déjalo vacío)
6. Genera el token y **cópialo inmediatamente**

---

### 2️⃣ Sube el Código a GitHub

```bash
# Si aún no has inicializado git:
git init
git add .
git commit -m "Proyecto listo para Vercel"

# Crea un repo en GitHub y conéctalo:
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

---

### 3️⃣ Despliega en Vercel

1. Ve a https://vercel.com
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa tu repositorio de GitHub
4. En **"Configure Project"**:
   - Framework Preset: **Other**
   - Root Directory: `.` (déjalo como está)
   - Build Command: déjalo vacío
   - Output Directory: déjalo vacío

---

### 4️⃣ 🔑 **CONFIGURA LA VARIABLE DE ENTORNO** (¡MUY IMPORTANTE!)

En la sección **"Environment Variables"**:

```
Key:   GITHUB_TOKEN
Value: [PEGA AQUÍ TU TOKEN DE GITHUB]

✅ Production
✅ Preview  
✅ Development
```

**Haz clic en "Add"** para agregar la variable.

---

### 5️⃣ Despliega

1. Haz clic en **"Deploy"**
2. Espera 1-2 minutos
3. ¡Listo! Tu sitio estará en `https://tu-proyecto.vercel.app`

---

## 🧪 Prueba el Chatbot

1. Abre tu sitio en Vercel
2. Busca el botón flotante del chat (esquina inferior derecha)
3. Haz clic y escribe un mensaje
4. ¡Deberías recibir una respuesta del asistente AI!

---

## ❌ Si Algo Sale Mal

### Error: "GitHub token not configured"
- Ve a Vercel → tu proyecto → **Settings** → **Environment Variables**
- Verifica que `GITHUB_TOKEN` esté configurado
- Si lo acabas de agregar, haz un **Redeploy**

### Error 401: Unauthorized
- Tu token no es válido
- Genera uno nuevo en GitHub
- Actualiza la variable en Vercel
- Haz Redeploy

### El chat no aparece
- Abre la consola del navegador (F12)
- Busca errores en rojo
- Verifica que los archivos existan:
  - `assets/js/chat-config.js`
  - `assets/js/chat.js`
  - `assets/css/chat.css`

---

## 📝 Actualizar el Sitio

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

Vercel automáticamente desplegará la nueva versión.

---

## ⚙️ Personalizar el Chatbot

Edita `assets/js/chat-config.js`:

```javascript
const CHAT_CONFIG = {
  model: 'gpt-4o',              // o 'gpt-4o-mini' (más rápido)
  temperature: 0.7,              // 0.0-1.0 (creatividad)
  maxTokens: 1000,               // Longitud de respuestas
  welcomeMessage: '¡Hola!...',   // Mensaje inicial
  systemPrompt: 'Eres un...'     // Personalidad
};
```

---

## 📚 Documentación Completa

Para más detalles, consulta:
- **VERCEL_DEPLOYMENT.md** - Guía completa con troubleshooting
- **README.md** - Información del proyecto
- **CHAT_README.md** - Detalles del chatbot

---

## ✅ Checklist

- [ ] Token de GitHub obtenido
- [ ] Código subido a GitHub  
- [ ] Proyecto importado en Vercel
- [ ] Variable `GITHUB_TOKEN` configurada
- [ ] Deployment exitoso
- [ ] Chatbot funcionando

---

## 🎉 ¡Eso es Todo!

Tu proyecto ahora está en producción con un chatbot AI completamente funcional.

**URL de tu proyecto**: https://tu-proyecto.vercel.app

¿Problemas? Revisa **VERCEL_DEPLOYMENT.md** para más ayuda.

