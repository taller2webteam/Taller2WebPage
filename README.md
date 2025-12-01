# 🏢 Taller2 - Dashboard de Monitoreo

Sistema web de monitoreo en tiempo real para dispositivos IoT con chatbot AI integrado.

## 🌟 Características

### Dashboard Principal
- 📊 Monitoreo en tiempo real de dispositivos IoT
- 📈 Gráficas interactivas de consumo eléctrico
- 🔔 Sistema de alertas y notificaciones
- 🎨 Interfaz moderna y responsive
- 🌓 Diseño adaptable a diferentes tamaños de pantalla

### Chatbot AI
- 🤖 Asistente virtual inteligente
- 💬 Respuestas en tiempo real
- 🧠 Powered by GitHub Models (GPT-4o)
- 🔒 Seguro y privado
- 📱 Disponible en todas las páginas

### Páginas
1. **Dashboard** (`index.html`) - Vista general y estadísticas
2. **Dispositivos** (`devices.html`) - Gestión de dispositivos
3. **Consumo** (`consumo.html`) - Análisis de consumo eléctrico
4. **Sugerencias** (`sugerencias.html`) - Recomendaciones de ahorro
5. **Contacto** (`contactanos.html`) - Formulario de contacto

## 🚀 Deployment en Vercel

### Inicio Rápido

1. **Obtén un token de GitHub Models**
   - Ve a [GitHub Models](https://github.com/marketplace/models)
   - Genera un Personal Access Token

2. **Despliega en Vercel**
   - Haz fork/clone de este repositorio
   - Importa el proyecto en [Vercel](https://vercel.com)
   - Agrega la variable de entorno `GITHUB_TOKEN`
   - ¡Despliega!

### Documentación Completa

Para una guía paso a paso detallada, consulta:
- 📖 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Guía completa de deployment
- 💬 [CHAT_README.md](./CHAT_README.md) - Documentación del chatbot

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Gráficas**: Chart.js
- **Iconos**: Material Symbols
- **Backend API**: Vercel Serverless Functions
- **AI**: GitHub Models API (GPT-4o)
- **Hosting**: Vercel

## 📁 Estructura del Proyecto

```
Taller2WebPage/
├── api/
│   └── chat.js                 # Serverless function para chatbot
├── assets/
│   ├── css/
│   │   ├── index.css          # Estilos del dashboard
│   │   ├── devices.css        # Estilos de dispositivos
│   │   ├── consumo.css        # Estilos de consumo
│   │   ├── sugerencias.css    # Estilos de sugerencias
│   │   └── contactanos.css    # Estilos de contacto
│   └── js/
│       ├── chat.js            # Lógica del chatbot
│       ├── chat-config.js     # Configuración del chatbot
│       ├── dashboard-data.js  # Datos del dashboard
│       ├── dashboard-filters.js # Filtros del dashboard
│       └── real-time-monitor.js # Monitor en tiempo real
├── index.html                  # Dashboard principal
├── devices.html                # Página de dispositivos
├── consumo.html                # Página de consumo
├── sugerencias.html            # Página de sugerencias
├── contactanos.html            # Página de contacto
├── vercel.json                 # Configuración de Vercel
├── .gitignore                  # Archivos ignorados por Git
└── README.md                   # Este archivo
```

## ⚙️ Configuración

### Variables de Entorno (Vercel)

En Vercel, configura las siguientes variables de entorno:

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `GITHUB_TOKEN` | Token de GitHub Models API | ✅ Sí |

### Configuración del Chatbot

Edita `assets/js/chat-config.js` para personalizar:

```javascript
const CHAT_CONFIG = {
  model: 'gpt-4o',              // Modelo de IA
  temperature: 0.7,              // Creatividad (0.0 - 1.0)
  maxTokens: 1000,               // Longitud de respuestas
  welcomeMessage: '¡Hola!...',   // Mensaje inicial
  systemPrompt: 'Eres un...'     // Personalidad del bot
};
```

## 🔒 Seguridad

- ✅ Token de API almacenado en variables de entorno
- ✅ API proxy en backend (no expone credenciales)
- ✅ CORS configurado correctamente
- ✅ Validación de entrada en el servidor
- ✅ Rate limiting por GitHub Models

## 📊 Funcionalidades del Dashboard

### Monitoreo en Tiempo Real
- Estado de dispositivos (activo/inactivo)
- Consumo actual de energía
- Gráficas de tendencias
- Alertas automáticas

### Filtros Avanzados
- Por tipo de dispositivo
- Por ubicación
- Por rango de consumo
- Por estado
- Por rango de fechas

### Estadísticas
- Consumo total
- Promedio por dispositivo
- Dispositivos activos/inactivos
- Tendencias históricas

## 🎨 Personalización

### Colores
Los colores principales están definidos como variables CSS en cada archivo CSS:

```css
:root {
  --color-primary: #00a6fb;
  --color-secondary: #0582ca;
  --color-accent: #ff006e;
  /* ... más colores */
}
```

### Modelos de IA Disponibles

En `chat-config.js` puedes cambiar el modelo:

- `gpt-4o` - Más potente (recomendado)
- `gpt-4o-mini` - Más rápido y económico
- `gpt-4` - Modelo anterior

## 🐛 Solución de Problemas

### El chatbot no responde
1. Verifica que `GITHUB_TOKEN` esté configurado en Vercel
2. Revisa los logs en Vercel Dashboard
3. Verifica que el token sea válido

### Errores 401/403
- Token inválido o expirado
- Genera un nuevo token en GitHub
- Actualiza la variable en Vercel

### Gráficas no cargan
- Verifica que Chart.js esté cargando correctamente
- Revisa la consola del navegador (F12)
- Verifica los datos en `dashboard-data.js`

## 📱 Responsive Design

El sitio está optimizado para:
- 🖥️ Desktop (1920px+)
- 💻 Laptop (1024px - 1919px)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (< 768px)

## 🔄 Actualizaciones

Para actualizar el sitio después del deployment:

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de cambios"
git push

# Vercel automáticamente desplegará la nueva versión
```

## 📞 Soporte

Para problemas o preguntas:
1. Revisa [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
2. Revisa [CHAT_README.md](./CHAT_README.md)
3. Abre un issue en GitHub
4. Usa la página de contacto del sitio

## 📄 Licencia

Este proyecto es de código abierto. Puedes usarlo y modificarlo libremente.

## 🙏 Créditos

- **UI/UX**: Diseño personalizado
- **Gráficas**: Chart.js
- **Iconos**: Google Material Symbols
- **AI**: GitHub Models (OpenAI GPT-4o)
- **Hosting**: Vercel

---

## 🎯 Inicio Rápido para Desarrollo Local

### Requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Editor de código (VS Code recomendado)
- Git

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/taller2-webpage.git
cd taller2-webpage

# Abrir con un servidor local
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js (http-server)
npx http-server -p 8000

# Opción 3: VS Code Live Server
# Instala la extensión "Live Server" y haz clic derecho > "Open with Live Server"
```

Abre `http://localhost:8000` en tu navegador.

**Nota**: Para que el chatbot funcione en local, necesitas:
1. Desplegar la API en Vercel primero
2. O crear un archivo `.env` con tu `GITHUB_TOKEN` y usar un servidor Node.js

---

¡Gracias por usar Taller2 Dashboard! 🎉
