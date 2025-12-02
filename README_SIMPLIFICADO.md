# Dashboard ESP32 IoT - Versión Simplificada

## 🎯 Descripción

Dashboard web minimalista para monitorear en tiempo real datos de tu ESP32 con sensores ACS712 (corriente) y FZ0430 (flama). **Sin datos de ejemplo, solo datos reales de tu dispositivo.**

## 📁 Estructura del Proyecto

```
Taller2WebPage/
├── index.html              # Panel de Control - Monitoreo en tiempo real
├── devices.html            # Vista de Dispositivos y Sensores
├── consumo.html            # Análisis de Consumo Eléctrico
├── assets/
│   ├── js/
│   │   ├── esp32-api.js           # Cliente API para ESP32
│   │   ├── real-time-monitor.js   # Monitoreo en tiempo real
│   │   ├── devices-monitor.js     # Monitor de dispositivos
│   │   └── consumo-monitor.js     # Cálculos de consumo
│   └── css/
│       └── [archivos de estilos]
├── test-esp32.html         # Herramienta de prueba de conexión
└── ESP32_SETUP.md          # Guía de configuración completa
```

## 🚀 Inicio Rápido

### 1. Probar Conexión con ESP32

Abre `test-esp32.html` en tu navegador:
```
1. Ingresa la IP de tu ESP32 (ejemplo: 192.168.1.100)
2. Haz clic en "Probar Todos los Endpoints"
3. Verifica que todos respondan ✅
```

### 2. Configurar Dashboard

Abre `index.html` en tu navegador:
```
1. En la sección "Configuración de Conexión"
2. Ingresa la IP de tu ESP32
3. Haz clic en "Guardar IP"
4. Haz clic en "Probar" para verificar conexión
5. Haz clic en "Iniciar Monitoreo"
```

## 📊 Páginas Disponibles

### Panel de Control (`index.html`)
- ✅ Configuración de IP de ESP32
- ✅ Monitoreo en tiempo real de corriente, voltaje y potencia
- ✅ Cálculo de costo mensual estimado
- ✅ Alertas automáticas de detección de flama
- ✅ Botón iniciar/detener monitoreo

### Dispositivos (`devices.html`)
- ✅ Configuración de IP de ESP32
- ✅ Estado de conexión del dispositivo
- ✅ Lecturas en tiempo real del sensor ACS712
- ✅ Estado del sensor de flama FZ0430
- ✅ Información del sistema (uptime, memoria, WiFi, RSSI)

### Consumo de Luz (`consumo.html`)
- ✅ Potencia actual en watts
- ✅ Consumo diario estimado (kWh)
- ✅ Consumo mensual estimado (kWh)
- ✅ Costo mensual estimado en pesos

## 🔌 Endpoints de la ESP32

El dashboard consume estos endpoints de tu ESP32:

| Endpoint | Descripción | Uso |
|----------|-------------|-----|
| `/sensores` | Todos los datos de sensores | Panel de Control |
| `/corriente` | Solo corriente y voltaje | Consumo de Luz |
| `/flama` | Solo sensor de flama | Alertas |
| `/status` | Estado del sistema ESP32 | Dispositivos |

## ⚙️ Configuración

### Cambiar Tarifa Eléctrica

**En `assets/js/real-time-monitor.js`:**
```javascript
const config = {
  costPerKWh: 3.20,    // <- Cambia este valor
  updateInterval: 2000
};
```

**En `assets/js/consumo-monitor.js`:**
```javascript
const costPerKWh = 3.20; // <- Cambia este valor
```

### Cambiar Intervalo de Actualización

**Panel de Control:**
```javascript
// assets/js/real-time-monitor.js
updateInterval: 2000  // milisegundos (2 segundos)
```

**Dispositivos:**
```javascript
// assets/js/devices-monitor.js
updateInterval = setInterval(updateDevicesData, 3000); // 3 segundos
```

**Consumo:**
```javascript
// assets/js/consumo-monitor.js
setInterval(updateConsumoData, 5000); // 5 segundos
```

## 🧹 Limpieza Realizada

### ❌ Eliminado:
- Datos de ejemplo de múltiples dispositivos
- Gráficas estáticas de consumo histórico
- Filtros de período (24h, 7d, 30d)
- Distribución por tipo de dispositivo
- Datos de sensores de temperatura/humedad
- Datos de cámaras
- Scripts innecesarios (`dashboard-data.js`, `dashboard-filters.js`)

### ✅ Mantenido:
- Input directo para configurar IP de ESP32
- Monitoreo en tiempo real de sensores
- Cálculos automáticos de consumo y costo
- Sistema de alertas de flama
- Información del sistema ESP32

## 🔥 Características Principales

1. **Sin Datos de Ejemplo**: Todo lo que ves proviene de tu ESP32
2. **Configuración Visual**: Input de texto para ingresar IP fácilmente
3. **Actualización Automática**: Datos en tiempo real sin intervención
4. **Alertas Inteligentes**: Notificaciones cuando se detecta fuego
5. **Cálculos Precisos**: Consumo y costos basados en mediciones reales
6. **Diseño Limpio**: UI minimalista enfocada en datos esenciales

## 🐛 Solución de Problemas

### No se conecta
1. Verifica que la IP sea correcta
2. Usa `test-esp32.html` para diagnosticar
3. Revisa la consola del navegador (F12)

### Datos no se actualizan
1. Haz clic en "Iniciar Monitoreo" en el Panel de Control
2. Verifica que el botón diga "Detener Monitoreo"
3. Revisa que no haya errores en la consola

### IP se borra al recargar
- La IP se guarda en `localStorage` del navegador
- Si se borra, puede ser por:
  - Navegación privada/incógnito
  - Limpieza de caché del navegador

## 📝 Notas Importantes

- **Persistencia**: La IP se guarda automáticamente en el navegador
- **CORS**: Ya configurado en el código ESP32 que proporcionaste
- **Valores Negativos**: La corriente negativa se muestra como valor absoluto
- **Cálculo de Consumo**: Asume uso 24/7 para estimaciones mensuales
- **Sin Historial**: No se almacenan datos históricos (solo tiempo real)

## 🎨 Personalización Adicional

### Cambiar Costo por kWh Globalmente
Busca `costPerKWh` en los archivos JS y actualiza el valor.

### Agregar Más Sensores
1. Modifica los endpoints de la ESP32
2. Actualiza `esp32-api.js` para consumir nuevos endpoints
3. Agrega visualización en HTML correspondiente

## 📧 Soporte

Para más información consulta:
- `ESP32_SETUP.md` - Guía detallada de configuración
- `test-esp32.html` - Herramienta de diagnóstico

---

**Versión**: Simplificada - Solo API Real  
**Última Actualización**: 2025

