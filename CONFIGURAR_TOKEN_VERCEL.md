# 🔑 CONFIGURAR TOKEN EN VERCEL - Paso a Paso

## 📍 Estás Aquí:
- ✅ Página funciona (CSS carga bien)
- ❌ Chatbot dice: "El servicio no está disponible"

## 🎯 Solución: Configurar GITHUB_TOKEN en Vercel

---

## 📝 PASOS EXACTOS

### **Paso 1: Obtén tu Token de GitHub Models**

1. Ve a: https://github.com/marketplace/models
2. Haz clic en **"Get started"**
3. Luego ve a: https://github.com/settings/tokens
4. Haz clic en **"Generate new token"** → **"Generate new token (classic)"**
5. Dale un nombre: `Vercel Chat Bot`
6. **NO selecciones NINGÚN permiso** (déjalo completamente vacío)
7. Haz clic en **"Generate token"**
8. **COPIA EL TOKEN INMEDIATAMENTE** (se parece a: `github_pat_11ABC...XYZ`)

---

### **Paso 2: Configurar en Vercel**

1. **Ve a tu proyecto en Vercel:**
   - Abre https://vercel.com
   - Haz clic en tu proyecto

2. **Ve a Settings:**
   - Click en la pestaña **"Settings"** (arriba)

3. **Ve a Environment Variables:**
   - En el menú lateral, click en **"Environment Variables"**

4. **Agregar la Variable:**
   - Click en **"Add New"** o **"Add"**
   
   **Completa así:**
   ```
   Name:  GITHUB_TOKEN
   Value: [PEGA TU TOKEN AQUI]
   
   Select Environments:
   ☑️ Production
   ☑️ Preview
   ☑️ Development
   ```
   
5. **Guardar:**
   - Click en **"Save"**

---

### **Paso 3: Redeploy**

Después de agregar la variable:

**Opción A - Automático (recomendado):**
```bash
git add vercel.json
git commit -m "Simplificar vercel.json"
git push
```
Vercel hará redeploy automáticamente (1-2 min)

**Opción B - Manual:**
1. En Vercel Dashboard → Deployments
2. Click en los 3 puntos (•••) del último deployment
3. Click en **"Redeploy"**

---

### **Paso 4: Probar el Chatbot**

Una vez que termine el redeploy:

1. Abre tu sitio: `https://tu-proyecto.vercel.app`
2. Haz clic en el botón flotante del chat (esquina inferior derecha)
3. Escribe: "Hola"
4. **Debería responder** ✅

---

## 🔍 Verificar que el Token está Configurado

En Vercel:
1. Settings → Environment Variables
2. Deberías ver:
   ```
   GITHUB_TOKEN
   Value: •••••••••••••••
   Production, Preview, Development
   ```

Si lo ves, ¡está configurado correctamente! ✅

---

## ❓ Si Aún No Funciona

### **Error: "El servicio no está disponible"**

**Causa 1:** Token no configurado
- **Solución:** Verifica que `GITHUB_TOKEN` esté en Environment Variables

**Causa 2:** Token inválido
- **Solución:** Genera un nuevo token y actualízalo en Vercel

**Causa 3:** No se hizo redeploy
- **Solución:** Haz redeploy manual (Deployments → ••• → Redeploy)

---

### **Verificar Logs de Error en Vercel:**

1. Ve a tu proyecto en Vercel
2. Click en **"Deployments"**
3. Click en el deployment más reciente
4. Click en **"Functions"**
5. Busca errores en los logs de `api/chat`

---

## 📋 Checklist

- [ ] Token generado en GitHub
- [ ] Token copiado
- [ ] Variable `GITHUB_TOKEN` agregada en Vercel
- [ ] Marcadas las 3 opciones (Production, Preview, Development)
- [ ] Guardada la variable
- [ ] Redeploy realizado
- [ ] Esperado 1-2 minutos
- [ ] Probado el chatbot
- [ ] ¡Funciona! 🎉

---

## 🎯 Resultado Esperado

Después de configurar el token:

```
Usuario: "Hola"
Bot: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?"
✅ FUNCIONA
```

---

## 📸 Capturas de Referencia

### En GitHub:
```
Settings → Developer Settings → Personal Access Tokens
→ Generate new token (classic)
→ NO seleccionar permisos
→ Generate token
```

### En Vercel:
```
Tu Proyecto → Settings → Environment Variables
→ Add New
→ GITHUB_TOKEN = [tu_token]
→ ☑️ Production ☑️ Preview ☑️ Development
→ Save
```

---

## 💡 Tips

1. **El token es secreto:** No lo compartas con nadie
2. **Solo en Vercel:** Nunca lo pongas en el código
3. **Un token por proyecto:** Puedes usar el mismo token en varios proyectos
4. **Sin permisos:** El token NO necesita permisos especiales

---

## 🎉 ¡Listo!

Una vez configurado, tu chatbot funcionará perfectamente.

**Tiempo estimado:** 5 minutos ⚡

