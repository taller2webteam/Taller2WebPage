// ============================================
// API CLIENT PARA ESP32 - IoT DEVICE
// ============================================

// Configuración de la ESP32
let esp32Config = {
  ip: localStorage.getItem('esp32_ip') || '192.168.1.100', // IP por defecto
  updateInterval: 2000, // 2 segundos
  timeout: 5000, // 5 segundos timeout
  simulatedVoltage: parseFloat(localStorage.getItem('esp32_simulated_voltage')) || 120, // Voltaje base simulado para uso doméstico (120V México/USA, cambia a 220V si es necesario)
  voltageVariation: 4 // Variación del voltaje ±4V (ej: 120V varía entre 116V y 124V)
};

// Variable para almacenar el último voltaje generado (para transiciones suaves)
let lastGeneratedVoltage = null;

// Estado de la conexión
let connectionState = {
  isConnected: false,
  lastUpdate: null,
  errorCount: 0,
  maxErrors: 3
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Genera un voltaje simulado con variación realista
 * El voltaje varía de forma suave usando cambios pequeños entre lecturas
 */
function generateRealisticVoltage() {
  const baseVoltage = esp32Config.simulatedVoltage;
  const variation = esp32Config.voltageVariation;
  
  // Si es la primera vez, generar un valor inicial
  if (lastGeneratedVoltage === null) {
    lastGeneratedVoltage = baseVoltage;
  }
  
  // Generar un cambio pequeño suave (máximo ±0.5V por lectura)
  const maxChange = 0.5;
  const change = (Math.random() - 0.5) * 2 * maxChange;
  
  // Aplicar el cambio al último voltaje
  let newVoltage = lastGeneratedVoltage + change;
  
  // Asegurar que esté dentro del rango permitido (base ± variation)
  const minVoltage = baseVoltage - variation;
  const maxVoltage = baseVoltage + variation;
  
  // Limitar el voltaje al rango permitido
  if (newVoltage < minVoltage) {
    newVoltage = minVoltage + Math.random() * 0.5;
  } else if (newVoltage > maxVoltage) {
    newVoltage = maxVoltage - Math.random() * 0.5;
  }
  
  // Guardar para la próxima lectura
  lastGeneratedVoltage = newVoltage;
  
  return newVoltage;
}

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
    
    // Generar voltaje simulado con variación realista
    const voltajeSimulado = generateRealisticVoltage();
    
    return {
      success: true,
      data: {
        corriente: data.acs712.corriente,
        voltaje: voltajeSimulado, // Voltaje simulado con variación ±4V
        voltajeOriginal: data.acs712.voltaje, // Guardar el valor original por si acaso
        adc: data.acs712.adc,
        flamaAnalog: data.flama.analog,
        flamaDetectada: data.flama.detectada,
        flamaEstado: data.flama.estado,
        timestamp: data.timestamp,
        uptime: data.uptime_ms,
        voltajeEsSimulado: true // Flag para indicar que el voltaje es simulado
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
    
    // Usar voltaje simulado ya que el sensor está dañado
    const voltajeSimulado = esp32Config.simulatedVoltage;
    const potenciaRecalculada = Math.abs(data.corriente) * voltajeSimulado;
    
    return {
      success: true,
      data: {
        corriente: data.corriente,
        voltaje: voltajeSimulado, // Voltaje simulado
        voltajeOriginal: data.voltaje, // Guardar el valor original
        potencia: potenciaRecalculada, // Recalcular con voltaje simulado
        timestamp: data.timestamp,
        voltajeEsSimulado: true
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

/**
 * Obtener estado del relé
 * Endpoint: /rele
 */
async function getReleStatus() {
  try {
    const response = await fetchWithTimeout(`http://${esp32Config.ip}/rele`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    connectionState.isConnected = true;
    connectionState.lastUpdate = Date.now();
    connectionState.errorCount = 0;
    
    return {
      success: true,
      data: {
        encendido: data.encendido,
        estado: data.estado
      }
    };
  } catch (error) {
    connectionState.errorCount++;
    console.error('Error al obtener estado del relé:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Encender el relé
 * Endpoint: /rele/on
 */
async function turnReleOn() {
  try {
    const response = await fetchWithTimeout(`http://${esp32Config.ip}/rele/on`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    connectionState.isConnected = true;
    connectionState.lastUpdate = Date.now();
    connectionState.errorCount = 0;
    
    return {
      success: data.success,
      data: {
        encendido: data.encendido,
        estado: data.estado,
        mensaje: data.mensaje
      }
    };
  } catch (error) {
    connectionState.errorCount++;
    console.error('Error al encender el relé:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Apagar el relé
 * Endpoint: /rele/off
 */
async function turnReleOff() {
  try {
    const response = await fetchWithTimeout(`http://${esp32Config.ip}/rele/off`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    connectionState.isConnected = true;
    connectionState.lastUpdate = Date.now();
    connectionState.errorCount = 0;
    
    return {
      success: data.success,
      data: {
        encendido: data.encendido,
        estado: data.estado,
        mensaje: data.mensaje
      }
    };
  } catch (error) {
    connectionState.errorCount++;
    console.error('Error al apagar el relé:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Toggle (cambiar estado) del relé
 * Endpoint: /rele/toggle
 */
async function toggleRele() {
  try {
    const response = await fetchWithTimeout(`http://${esp32Config.ip}/rele/toggle`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    connectionState.isConnected = true;
    connectionState.lastUpdate = Date.now();
    connectionState.errorCount = 0;
    
    return {
      success: data.success,
      data: {
        encendido: data.encendido,
        estado: data.estado,
        mensaje: data.mensaje
      }
    };
  } catch (error) {
    connectionState.errorCount++;
    console.error('Error al cambiar estado del relé:', error);
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
 * Configurar voltaje simulado (para cuando el sensor de voltaje está dañado)
 */
function setSimulatedVoltage(voltage) {
  esp32Config.simulatedVoltage = voltage;
  localStorage.setItem('esp32_simulated_voltage', voltage);
  console.log(`Voltaje simulado actualizado a: ${voltage}V`);
}

/**
 * Obtener el voltaje simulado configurado
 */
function getSimulatedVoltage() {
  return esp32Config.simulatedVoltage;
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
    
    // Funciones de control del relé
    getReleStatus,
    turnReleOn,
    turnReleOff,
    toggleRele,
    
    // Funciones de configuración
    setESP32IP,
    getESP32IP,
    setSimulatedVoltage,
    getSimulatedVoltage,
    getConnectionState,
    resetErrorCount,
    
    // Configuración
    config: esp32Config
  };
}

