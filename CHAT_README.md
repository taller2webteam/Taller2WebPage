# Chat Asistente Virtual - Configuración

Este proyecto incluye un chat asistente virtual integrado que utiliza GitHub Models API.

## 🔧 Configuración del Token

### Paso 1: Obtener tu Token de GitHub

1. Ve a [GitHub Models](https://github.com/marketplace/models)
2. Inicia sesión con tu cuenta de GitHub
3. Genera un token de acceso personal (Personal Access Token)
4. Copia el token generado

### Paso 2: Configurar el Token en el Proyecto

Abre el archivo `assets/js/chat.js` y busca la línea:

```javascript
const GITHUB_TOKEN = 'TU_TOKEN_DE_GITHUB_AQUI';
```

**NOTA:** El proyecto ahora usa variables de entorno de Vercel para mayor seguridad.
El token ya no se configura en este archivo, sino en las variables de entorno del servidor.

### Paso 3: (Opcional) Cambiar el Modelo

Por defecto, el chat usa el modelo `gpt-4o`. Puedes cambiarlo editando:

```javascript
const GITHUB_MODEL = 'gpt-4o'; // Opciones: gpt-4o, gpt-4o-mini, etc.
```

## 📋 Modelos Disponibles

- `gpt-4o` - Modelo más potente (recomendado)
- `gpt-4o-mini` - Modelo más rápido y económico
- `gpt-4` - Modelo anterior
- Otros modelos disponibles en GitHub Models

## 🎨 Características del Chat

- ✅ Interfaz moderna y responsive
- ✅ Botón flotante en la esquina inferior derecha
- ✅ Animaciones suaves
- ✅ Indicador de escritura
- ✅ Historial de conversación
- ✅ Manejo de errores
- ✅ Soporte para formato básico de texto
- ✅ Compatible con todas las páginas del sitio

## 🚀 Uso

1. Haz clic en el botón flotante con el ícono de chat
2. Escribe tu mensaje en el campo de texto
3. Presiona Enter o haz clic en el botón de enviar
4. El asistente responderá automáticamente

## 📱 Responsive

El chat se adapta automáticamente a dispositivos móviles:
- En pantallas grandes: 380px de ancho
- En móviles: Ocupa casi todo el ancho de la pantalla

## 🎨 Personalización de Estilos

Los estilos del chat están en `assets/css/index.css` bajo la sección "Chat Widget Styles".

Puedes personalizar:
- Colores (usa las variables CSS como `var(--color-primary)`)
- Tamaños
- Animaciones
- Posición del botón flotante

## 🔒 Seguridad

⚠️ **IMPORTANTE**: No subas tu token a repositorios públicos. 

Para producción, considera:
- Usar variables de entorno
- Implementar un backend proxy
- Usar servicios de gestión de secretos

## 🐛 Solución de Problemas

### El chat no responde
- Verifica que el token esté configurado correctamente
- Revisa la consola del navegador (F12) para ver errores
- Asegúrate de tener conexión a internet

### Error 401 o 403
- Tu token no es válido o ha expirado
- Genera un nuevo token en GitHub

### Error 429
- Has excedido el límite de solicitudes
- Espera unos minutos antes de intentar de nuevo

## 📄 Archivos del Chat

- `assets/js/chat.js` - Lógica del chat y configuración
- `assets/css/index.css` - Estilos del chat (sección "Chat Widget Styles")
- `assets/chat-widget.html` - HTML del widget (para referencia)

## 🌐 Agregar el Chat a Otras Páginas

Para agregar el chat a otras páginas HTML, incluye antes del cierre de `</body>`:

```html
<!-- Chat Button -->
<button id="chatButton" class="chat-fab">
  <span class="material-symbols-outlined">chat</span>
</button>

<!-- Chat Window -->
<div id="chatWindow" class="chat-window">
  <div class="chat-header">
    <div class="flex items-center gap-2">
      <span class="material-symbols-outlined">smart_toy</span>
      <h3>Asistente Virtual</h3>
    </div>
    <button id="closeChat" class="chat-close-btn">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div id="chatMessages" class="chat-messages">
    <div class="chat-message assistant-message">
      <div class="message-avatar">
        <span class="material-symbols-outlined">smart_toy</span>
      </div>
      <div class="message-content">
        ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
      </div>
    </div>
  </div>
  <div class="chat-input-container">
    <input type="text" id="chatInput" class="chat-input" placeholder="Escribe tu mensaje...">
    <button id="sendMessage" class="chat-send-btn">
      <span class="material-symbols-outlined">send</span>
    </button>
  </div>
</div>

<!-- Chat Assistant Script -->
<script src="assets/js/chat.js"></script>
```

Y asegúrate de que el CSS incluya los estilos del chat.

