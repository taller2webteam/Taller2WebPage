# 🚀 Guía Completa de Deployment en Vercel

Esta guía te ayudará a desplegar tu proyecto en Vercel con el chatbot AI funcionando usando GitHub Models API.

## 📋 Prerequisitos

1. **Cuenta de GitHub** - [Registrarse](https://github.com/signup)
2. **Cuenta de Vercel** - [Registrarse](https://vercel.com/signup)
3. **Token de GitHub Models** - [Obtener token](https://github.com/marketplace/models)

---

## 🔑 Paso 1: Obtener tu Token de GitHub Models

### 1.1 Acceder a GitHub Models

1. Ve a [GitHub Marketplace Models](https://github.com/marketplace/models)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en "Get started" o "Start using"

### 1.2 Generar Personal Access Token

1. Ve a [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Haz clic en **"Generate new token"** > **"Generate new token (classic)"**
3. Dale un nombre descriptivo, por ejemplo: `Vercel Chat Bot`
4. **Importante:** No selecciones ningún scope/permiso específico (déjalo vacío para solo acceso a modelos)
5. Haz clic en **"Generate token"**
6. **¡COPIA EL TOKEN INMEDIATAMENTE!** No podrás verlo de nuevo

> ⚠️ **IMPORTANTE**: Guarda el token en un lugar seguro. Lo necesitarás en el siguiente paso.

---

## 📦 Paso 2: Subir tu Proyecto a GitHub

### 2.1 Crear un Repositorio en GitHub

1. Ve a [GitHub](https://github.com) y haz clic en el botón **"+"** > **"New repository"**
2. Dale un nombre a tu repositorio (ej: `taller2-webpage`)
3. Selecciona **"Public"** o **"Private"** según prefieras
4. **NO** inicialices con README, .gitignore o licencia (ya los tienes)
5. Haz clic en **"Create repository"**

### 2.2 Subir tu Código (si aún no lo has hecho)

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
# Si aún no has inicializado git:
git init

# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "Configuración inicial para Vercel"

# Conectar con tu repositorio (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/tu-repositorio.git

# Subir el código
git branch -M main
git push -u origin main
```

---

## 🌐 Paso 3: Desplegar en Vercel

### 3.1 Conectar Vercel con GitHub

1. Ve a [Vercel](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New..."** > **"Project"**
3. En "Import Git Repository", busca tu repositorio
4. Haz clic en **"Import"** junto a tu repositorio

### 3.2 Configurar el Proyecto

En la página de configuración:

1. **Framework Preset**: Selecciona **"Other"** (es un sitio estático con API)
2. **Root Directory**: Deja `.` (raíz)
3. **Build Command**: Deja vacío o pon `echo "Static site"`
4. **Output Directory**: Deja vacío o pon `.`

### 3.3 Configurar Variables de Entorno (¡MUY IMPORTANTE!)

Esta es la parte **MÁS IMPORTANTE**. Aquí es donde debes poner tu token:

1. En la sección **"Environment Variables"**
2. Haz clic en el campo **"Key"** y escribe: `GITHUB_TOKEN`
3. En el campo **"Value"**, pega tu token de GitHub Models que copiaste en el Paso 1
4. Asegúrate de que esté seleccionado para todos los ambientes: **Production**, **Preview**, y **Development**

Debe verse así:
```
Key:   GITHUB_TOKEN
Value: github_pat_11ABC...XYZ (tu token real)
[x] Production
[x] Preview  
[x] Development
```

5. Haz clic en **"Add"** para agregar la variable

### 3.4 Desplegar

1. Verifica que todo esté correcto
2. Haz clic en **"Deploy"**
3. Espera a que termine el deployment (1-3 minutos)
4. ¡Listo! Tu sitio estará disponible en una URL como `https://tu-proyecto.vercel.app`

---

## ✅ Paso 4: Verificar que Funciona

### 4.1 Probar el Sitio

1. Abre la URL que te dio Vercel
2. Verás tu página web
3. Busca el botón flotante del chat en la esquina inferior derecha (ícono de chat)
4. Haz clic en el botón para abrir el chat

### 4.2 Probar el Chatbot

1. Escribe un mensaje de prueba como: "Hola, ¿cómo estás?"
2. Presiona Enter o haz clic en el botón de enviar
3. Deberías recibir una respuesta del asistente virtual

### 4.3 Si Algo Sale Mal

Si el chat no funciona, abre la consola del navegador (F12) y busca errores:

**Error 401/403**: El token no está configurado o no es válido
- Verifica que agregaste el `GITHUB_TOKEN` en las variables de entorno
- Verifica que el token sea válido y no haya expirado

**Error 500**: Problema con el servidor
- Revisa los logs en Vercel Dashboard > tu proyecto > Deployments > [último deployment] > Functions

**No aparece el botón del chat**: 
- Verifica que todas las páginas HTML incluyan el script del chat

---

## 🔧 Configuración Adicional

### Personalizar el Chatbot

Edita el archivo `assets/js/chat-config.js`:

```javascript
const CHAT_CONFIG = {
  // 🤖 Modelo a usar
  model: 'gpt-4o', // Opciones: 'gpt-4o', 'gpt-4o-mini'
  
  // 🌡️ Temperatura (creatividad)
  temperature: 0.7, // 0.0 = preciso, 1.0 = creativo
  
  // 📝 Máximo de tokens
  maxTokens: 1000,
  
  // 💬 Mensaje de bienvenida
  welcomeMessage: '¡Hola! ¿En qué puedo ayudarte?',
  
  // 🎭 Personalidad del asistente
  systemPrompt: 'Eres un asistente útil...'
};
```

Después de hacer cambios, sube los cambios a GitHub:

```bash
git add .
git commit -m "Actualizar configuración del chat"
git push
```

Vercel automáticamente detectará los cambios y desplegará la nueva versión.

### Cambiar el Modelo de IA

En `assets/js/chat-config.js`, cambia el `model`:

- `gpt-4o` - Más potente y preciso (recomendado)
- `gpt-4o-mini` - Más rápido y económico
- `gpt-4` - Modelo anterior

---

## 🔒 Seguridad

### ✅ Buenas Prácticas

- ✅ Token guardado en variables de entorno de Vercel (NO en el código)
- ✅ API protegida en el backend (`/api/chat.js`)
- ✅ El frontend nunca expone el token
- ✅ `.gitignore` configurado para no subir archivos sensibles

### ⚠️ NO HAGAS ESTO

- ❌ NO compartas tu token de GitHub
- ❌ NO subas el token en el código fuente
- ❌ NO expongas el token en el frontend
- ❌ NO uses el mismo token para múltiples proyectos públicos

---

## 📊 Administración en Vercel

### Ver Variables de Entorno

1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Aquí puedes ver, editar o agregar variables

**Para cambiar el token:**
1. Elimina la variable `GITHUB_TOKEN` antigua
2. Agrega una nueva con el token nuevo
3. Redeploy del proyecto

### Ver Logs y Errores

1. Ve a tu proyecto en Vercel
2. Deployments > [selecciona un deployment]
3. Haz clic en "Functions" para ver logs de la API

### Redeploy Manual

Si necesitas forzar un nuevo deployment:
1. Ve a Deployments
2. Encuentra el último deployment
3. Haz clic en los tres puntos (•••) > "Redeploy"

---

## 🚨 Solución de Problemas Comunes

### El chat no aparece
- Verifica que todas las páginas HTML incluyan:
  ```html
  <script src="assets/js/chat-config.js"></script>
  <script src="assets/js/chat.js"></script>
  ```

### Error: "GitHub token not configured"
- Ve a Vercel > tu proyecto > Settings > Environment Variables
- Asegúrate de que `GITHUB_TOKEN` esté configurado
- Si acabas de agregarlo, haz un redeploy

### Error 401: Unauthorized
- Tu token no es válido o expiró
- Genera un nuevo token en GitHub
- Actualiza la variable `GITHUB_TOKEN` en Vercel
- Haz un redeploy

### Error 429: Rate Limit
- Has excedido el límite de solicitudes gratuitas
- Espera unos minutos
- Considera usar el modelo `gpt-4o-mini` (límites más altos)

### El chat responde muy lento
- Cambia a `gpt-4o-mini` en `chat-config.js`
- Reduce `maxTokens` para respuestas más cortas

---

## 📱 Funcionalidades del Chat

### Características Incluidas
- ✅ Botón flotante responsive
- ✅ Ventana de chat deslizante
- ✅ Indicador de escritura
- ✅ Historial de conversación
- ✅ Formateo básico de texto (negritas, cursivas)
- ✅ Manejo de errores amigable
- ✅ Diseño adaptable a móviles

### Páginas que Incluyen el Chat
- `index.html` (Dashboard)
- `devices.html` (Dispositivos)
- `consumo.html` (Consumo)
- `sugerencias.html` (Sugerencias)
- `contactanos.html` (Contáctanos)

---

## 🎯 Dominio Personalizado (Opcional)

### Conectar tu Propio Dominio

1. Ve a tu proyecto en Vercel
2. Settings > Domains
3. Agrega tu dominio (ej: `www.midominio.com`)
4. Sigue las instrucciones para configurar DNS
5. Vercel automáticamente generará certificados SSL

---

## 📞 Recursos y Ayuda

### Documentación Oficial
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Models](https://github.com/marketplace/models)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### Soporte
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [GitHub Support](https://support.github.com/)

---

## 🎉 ¡Listo!

Tu proyecto ahora está desplegado en Vercel con un chatbot AI completamente funcional.

**URL de tu proyecto**: `https://tu-proyecto.vercel.app`

Cada vez que hagas cambios y los subas a GitHub con `git push`, Vercel automáticamente desplegará la nueva versión.

---

## 📝 Checklist Final

Antes de considerar el deployment completo, verifica:

- [ ] Repositorio creado en GitHub
- [ ] Código subido a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Variable `GITHUB_TOKEN` configurada en Vercel
- [ ] Deployment exitoso (sin errores)
- [ ] Sitio web carga correctamente
- [ ] Botón de chat aparece en todas las páginas
- [ ] Chat responde a mensajes
- [ ] Sin errores en la consola del navegador

Si todos los puntos están marcados, ¡tu proyecto está completamente funcional! 🎊

