# Configuración ESP32 IoT Device - Dashboard

## 📋 Descripción

Este dashboard está configurado para consumir datos en tiempo real de tu dispositivo ESP32 que incluye:
- **Sensor ACS712**: Medición de corriente y voltaje
- **Sensor FZ0430**: Detector de flama/fuego

## 🔧 Configuración Inicial

### 1. Preparar tu ESP32

1. Sube el código Arduino a tu ESP32 (el código que proporcionaste)
2. Asegúrate de que tu ESP32 esté conectado a la misma red WiFi que tu computadora
3. Anota la dirección IP que se muestra en el Monitor Serial de Arduino

### 2. Configurar el Dashboard

**Opción 1: Desde la interfaz web**

1. Abre el dashboard en tu navegador
2. Ve a la página "Panel de Control" (index.html)
3. Haz clic en el botón "Configurar ESP32" 
4. Ingresa la dirección IP de tu ESP32 (ejemplo: `192.168.1.100`)
5. Haz clic en "Guardar"
6. Haz clic en "Iniciar Monitoreo"

**Opción 2: Configurar manualmente en el código**

Edita el archivo `assets/js/esp32-api.js` en la línea 6:

```javascript
ip: localStorage.getItem('esp32_ip') || '192.168.1.100', // Cambia esta IP
```

## 📡 Endpoints Disponibles

Tu ESP32 expone los siguientes endpoints:

### `/sensores` - Datos completos
Retorna todos los datos de sensores (corriente, voltaje, flama)

**Respuesta de ejemplo:**
```json
{
  "acs712": {
    "adc": 2048,
    "voltaje": 2.5,
    "corriente": 0.0,
    "unidad_corriente": "A",
    "unidad_voltaje": "V"
  },
  "flama": {
    "analog": 4095,
    "detectada": false,
    "estado": "OK"
  },
  "timestamp": 12345,
  "uptime_ms": 123456
}
```

### `/corriente` - Solo datos de corriente
**Respuesta de ejemplo:**
```json
{
  "corriente": 0.15,
  "voltaje": 120.0,
  "potencia_estimada": 18.0,
  "timestamp": 12345
}
```

### `/flama` - Solo datos de flama
**Respuesta de ejemplo:**
```json
{
  "analog": 4095,
  "detectada": false,
  "estado": "OK",
  "timestamp": 12345
}
```

### `/status` - Estado del sistema
**Respuesta de ejemplo:**
```json
{
  "uptime": 123456,
  "freeHeap": 123456,
  "ip": "192.168.1.100",
  "rssi": -45,
  "ssid": "JJ"
}
```

## 🌐 Páginas del Dashboard

### 1. Panel de Control (`index.html`)
- Monitoreo en tiempo real de corriente, voltaje y potencia
- Cálculo de costo estimado mensual
- Alertas de flama en tiempo real
- Botón para iniciar/detener monitoreo

### 2. Dispositivos (`devices.html`)
- Vista de estado de la ESP32
- Datos en tiempo real de todos los sensores
- Información del sistema (uptime, memoria, WiFi)
- Configuración de IP

### 3. Consumo de Luz (`consumo.html`)
- Consumo diario y mensual calculado
- Costo estimado basado en tarifa eléctrica
- Actualización automática cada 5 segundos

## ⚙️ Personalización

### Cambiar el costo por kWh

Edita los siguientes archivos:

**Para la página principal:**
`assets/js/real-time-monitor.js` línea 9:
```javascript
costPerKWh: 3.20,    // Cambia este valor según tu tarifa
```

**Para la página de consumo:**
`assets/js/consumo-monitor.js` línea 13:
```javascript
const costPerKWh = 3.20; // Cambia este valor
```

### Cambiar intervalo de actualización

**Panel de Control:**
`assets/js/real-time-monitor.js` línea 10:
```javascript
updateInterval: 2000  // Milisegundos (2000 = 2 segundos)
```

**Dispositivos:**
`assets/js/devices-monitor.js` línea 236:
```javascript
updateInterval = setInterval(updateDevicesData, 3000); // 3 segundos
```

**Consumo:**
`assets/js/consumo-monitor.js` línea 53:
```javascript
setInterval(updateConsumoData, 5000); // 5 segundos
```

## 🔥 Alertas de Flama

El sistema mostrará automáticamente:
- Notificación visual cuando se detecte fuego
- Alerta en el panel de control
- Estado actualizado en tiempo real en la página de dispositivos

## 🐛 Solución de Problemas

### No se conecta a la ESP32

1. Verifica que la ESP32 esté encendida
2. Confirma que estás en la misma red WiFi
3. Verifica la IP en el Monitor Serial de Arduino
4. Prueba acceder directamente a `http://[IP_ESP32]/status` en tu navegador
5. Asegúrate de que CORS esté habilitado en la ESP32 (ya está en tu código)

### Datos no se actualizan

1. Abre la Consola del Navegador (F12)
2. Busca errores en la pestaña "Console"
3. Verifica que hayas hecho clic en "Iniciar Monitoreo"
4. Confirma que la IP configurada sea correcta

### Error de CORS

El código de la ESP32 ya incluye headers CORS, pero si tienes problemas:
- Asegúrate de acceder al dashboard usando `http://` (no `https://`)
- No uses `file://` - sirve el dashboard con un servidor web local

## 📝 Notas Importantes

- La IP de la ESP32 se guarda en `localStorage` del navegador
- Los datos se actualizan automáticamente en segundo plano
- El cálculo de consumo mensual asume uso 24/7
- Todos los valores negativos de corriente se muestran como valores absolutos

## 🚀 Próximos Pasos

1. Configura la IP de tu ESP32
2. Inicia el monitoreo
3. Observa los datos en tiempo real
4. Personaliza los costos y intervalos según tus necesidades

¡Listo! Ahora tu dashboard está completamente integrado con tu ESP32 IoT Device.

