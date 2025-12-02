// ============================================
// API CLIENT PARA ESP32 - IoT DEVICE
// ============================================

// Configuración de la ESP32
let esp32Config = {
  ip: localStorage.getItem('esp32_ip') || '192.168.1.100', // IP por defecto
  updateInterval: 2000, // 2 segundos
  timeout: 5000 // 5 segundos timeout
};

// Estado de la conexión
let connectionState = {
  isConnected: false,
  lastUpdate: null,
  errorCount: 0,
  maxErrors: 3
};

// ============================================
// FUNCIONES PARA CONSUMIR ENDPOINTS
// ============================================

/**
 * Función genérica para hacer fetch con timeout
 */
async function fetchWithTimeout(url, timeout = esp32Config.timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      mode: 'cors'
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Obtener todos los datos de sensores
 * Endpoint: /sensores
 */
async function getSensoresData() {
  try {
    const response = await fetchWithTimeout(`http://${esp32Config.ip}/sensores`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    connectionState.isConnected = true;
    connectionState.lastUpdate = Date.now();
    connectionState.errorCount = 0;
    
    return {
      success: true,
      data: {
        corriente: data.acs712.corriente,
        voltaje: data.acs712.voltaje,
        adc: data.acs712.adc,
        flamaAnalog: data.flama.analog,
        flamaDetectada: data.flama.detectada,
        flamaEstado: data.flama.estado,
        timestamp: data.timestamp,
        uptime: data.uptime_ms
      }
    };
  } catch (error) {
    connectionState.errorCount++;
    if (connectionState.errorCount >= connectionState.maxErrors) {
      connectionState.isConnected = false;
    }
    console.error('Error al obtener datos de sensores:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener solo datos de corriente
 * Endpoint: /corriente
 */
async function getCorrienteData() {
  try {
    const response = await fetchWithTimeout(`http://${esp32Config.ip}/corriente`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    connectionState.isConnected = true;
    connectionState.lastUpdate = Date.now();
    connectionState.errorCount = 0;
    
    return {
      success: true,
      data: {
        corriente: data.corriente,
        voltaje: data.voltaje,
        potencia: data.potencia_estimada,
        timestamp: data.timestamp
      }
    };
  } catch (error) {
    connectionState.errorCount++;
    console.error('Error al obtener datos de corriente:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener solo datos de flama
 * Endpoint: /flama
 */
async function getFlamaData() {
  try {
    const response = await fetchWithTimeout(`http://${esp32Config.ip}/flama`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    connectionState.isConnected = true;
    connectionState.lastUpdate = Date.now();
    connectionState.errorCount = 0;
    
    return {
      success: true,
      data: {
        analog: data.analog,
        detectada: data.detectada,
        estado: data.estado,
        timestamp: data.timestamp
      }
    };
  } catch (error) {
    connectionState.errorCount++;
    console.error('Error al obtener datos de flama:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener estado del sistema ESP32
 * Endpoint: /status
 */
async function getStatusData() {
  try {
    const response = await fetchWithTimeout(`http://${esp32Config.ip}/status`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    connectionState.isConnected = true;
    connectionState.lastUpdate = Date.now();
    connectionState.errorCount = 0;
    
    return {
      success: true,
      data: {
        uptime: data.uptime,
        freeHeap: data.freeHeap,
        ip: data.ip,
        rssi: data.rssi,
        ssid: data.ssid
      }
    };
  } catch (error) {
    connectionState.errorCount++;
    console.error('Error al obtener estado del sistema:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// FUNCIONES DE CONFIGURACIÓN
// ============================================

/**
 * Actualizar la IP de la ESP32
 */
function setESP32IP(newIP) {
  esp32Config.ip = newIP;
  localStorage.setItem('esp32_ip', newIP);
  console.log(`IP de ESP32 actualizada a: ${newIP}`);
}

/**
 * Obtener la IP configurada
 */
function getESP32IP() {
  return esp32Config.ip;
}

/**
 * Obtener estado de conexión
 */
function getConnectionState() {
  return {
    ...connectionState,
    timeSinceLastUpdate: connectionState.lastUpdate 
      ? Date.now() - connectionState.lastUpdate 
      : null
  };
}

/**
 * Resetear contador de errores
 */
function resetErrorCount() {
  connectionState.errorCount = 0;
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================

if (typeof window !== 'undefined') {
  window.ESP32API = {
    // Funciones de datos
    getSensoresData,
    getCorrienteData,
    getFlamaData,
    getStatusData,
    
    // Funciones de configuración
    setESP32IP,
    getESP32IP,
    getConnectionState,
    resetErrorCount,
    
    // Configuración
    config: esp32Config
  };
}

