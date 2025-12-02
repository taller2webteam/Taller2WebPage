// ============================================
// MONITOREO EN TIEMPO REAL - ESP32 IoT DEVICE
// ============================================

let isMonitoring = false;
let monitoringInterval = null;

// Configuración
const config = {
  costPerKWh: 3.20,
  updateInterval: 2000
};

// Última alerta de flama mostrada
let lastFlameAlert = null;

// Estado del relé - MEJORADO con timestamp
let releState = {
  encendido: false,
  updating: false,
  lastManualChange: 0  // ⭐ Timestamp del último cambio manual
};

// Función para actualizar los valores en tiempo real desde la ESP32
async function updateRealTimeValues() {
  if (typeof window.ESP32API === 'undefined') {
    console.error('ESP32API no está disponible');
    showNotification('Error', 'API de ESP32 no está cargada', 'danger');
    return;
  }
  
  console.log('🔄 Obteniendo datos de ESP32...');
  
  const result = await window.ESP32API.getSensoresData();
  
  if (!result.success) {
    console.error('❌ Error al obtener datos:', result.error);
    updateConnectionStatus(false, result.error);
    return;
  }
  
  console.log('✅ Datos recibidos correctamente');
  const data = result.data;
  
  updateConnectionStatus(true);
  
  // Calcular potencia
  const power = Math.abs(data.corriente) * data.voltaje;
  
  // Calcular costo mensual
  const kWhPerDay = (power / 1000) * 24;
  const kWhPerMonth = kWhPerDay * 30;
  const monthlyCost = kWhPerMonth * config.costPerKWh;
  
  // Actualizar UI de sensores
  updateSensorUI(data, power, monthlyCost);
  
  // Manejar alertas de flama
  handleFlameAlert(data.flamaDetectada, data.flamaEstado);
  updateFlameIndicator(data.flamaDetectada, data.flamaEstado, data.flamaAnalog);
  
  // Almacenar datos para historial
  storeDataPoint(data.corriente, data.voltaje, power);
  
  // ⭐ ACTUALIZAR RELÉ - Solo si no ha habido cambio manual reciente
  const timeSinceManualChange = Date.now() - releState.lastManualChange;
  
  if (data.releEncendido !== undefined) {
    // Si han pasado más de 3 segundos desde el último cambio manual, actualizar
    if (timeSinceManualChange > 3000) {
      if (data.releEncendido !== releState.encendido) {
        console.log(`🔄 Sincronizando estado del relé: ${data.releEncendido}`);
        releState.encendido = data.releEncendido;
        updateReleUI(data.releEncendido);
      }
    } else {
      console.log(`⏸️ Ignorando actualización de relé (cambio manual reciente: ${timeSinceManualChange}ms)`);
    }
  }
}

// Función para actualizar UI de sensores (separada para claridad)
function updateSensorUI(data, power, monthlyCost) {
  // Corriente
  const currentElement = document.getElementById('current-value');
  if (currentElement) {
    currentElement.textContent = `${Math.abs(data.corriente).toFixed(2)} A`;
  }
  const tableCurrent = document.getElementById('table-current');
  if (tableCurrent) {
    tableCurrent.textContent = `${Math.abs(data.corriente).toFixed(2)} A`;
  }
  
  // Voltaje
  const voltageElement = document.getElementById('voltage-value');
  if (voltageElement) {
    voltageElement.textContent = `${data.voltaje.toFixed(1)} V`;
  }
  const tableVoltage = document.getElementById('table-voltage');
  if (tableVoltage) {
    tableVoltage.textContent = `${data.voltaje.toFixed(1)} V`;
  }
  
  // Potencia
  const powerElement = document.getElementById('power-value');
  if (powerElement) {
    powerElement.textContent = `${power.toFixed(0)} W`;
  }
  const tablePower = document.getElementById('table-power');
  if (tablePower) {
    tablePower.textContent = `${power.toFixed(0)} W`;
  }
  
  // Costo
  const costElement = document.getElementById('cost-value');
  if (costElement) {
    costElement.textContent = `$${monthlyCost.toFixed(0)}`;
  }
  
  // Tendencia
  const costTrendElement = document.getElementById('cost-trend');
  if (costTrendElement) {
    costTrendElement.textContent = 'En tiempo real';
    costTrendElement.style.color = '#10b981';
  }
  
  updateStatusIndicators('En tiempo real');
}

// Función para actualizar la UI del relé
function updateReleUI(encendido) {
  const button = document.getElementById('toggle-rele-btn');
  const statusText = document.getElementById('rele-status-text');
  const icon = document.getElementById('rele-icon');
  
  if (button) {
    button.disabled = false;
    
    if (encendido) {
      button.style.background = '#ef4444';
      button.innerHTML = `
        <span class="material-symbols-outlined text-white text-[20px]">power_settings_new</span>
        <span>Apagar</span>
      `;
    } else {
      button.style.background = '#10b981';
      button.innerHTML = `
        <span class="material-symbols-outlined text-white text-[20px]">power_settings_new</span>
        <span>Encender</span>
      `;
    }
  }
  
  if (statusText) {
    statusText.textContent = `Estado: ${encendido ? 'Encendido' : 'Apagado'}`;
    statusText.style.color = encendido ? '#10b981' : '#6b7280';
  }
  
  if (icon) {
    icon.style.color = encendido ? '#10b981' : '#6b7280';
  }
}

// ⭐ FUNCIÓN MEJORADA PARA TOGGLE DEL RELÉ
async function toggleReleState() {
  if (releState.updating) {
    console.log('⏸️ Ya hay una actualización en progreso');
    return;
  }
  
  releState.updating = true;
  const button = document.getElementById('toggle-rele-btn');
  
  // Mostrar estado de carga
  if (button) {
    button.disabled = true;
    button.innerHTML = `
      <span class="material-symbols-outlined text-white text-[20px]">hourglass_empty</span>
      <span>Procesando...</span>
    `;
  }
  
  try {
    console.log('🔄 Enviando toggle al ESP32...');
    const result = await window.ESP32API.toggleRele();
    
    if (result.success) {
      console.log('✅ Toggle exitoso:', result.data);
      
      // ⭐ Actualizar estado Y marcar timestamp de cambio manual
      releState.encendido = result.data.encendido;
      releState.lastManualChange = Date.now();
      
      // Actualizar UI inmediatamente
      updateReleUI(result.data.encendido);
      
      const action = result.data.encendido ? 'encendido' : 'apagado';
      showNotification('Relé Actualizado', `El relé ha sido ${action}`, 'success');
      
      // Liberar bloqueo después de un momento
      setTimeout(() => {
        releState.updating = false;
      }, 500);
    } else {
      console.error('❌ Error al hacer toggle:', result.error);
      showNotification('Error', 'No se pudo cambiar el estado del relé', 'danger');
      
      if (button) {
        button.disabled = false;
        updateReleUI(releState.encendido);
      }
      releState.updating = false;
    }
  } catch (error) {
    console.error('❌ Excepción al hacer toggle:', error);
    showNotification('Error', 'Error al comunicarse con el ESP32', 'danger');
    
    if (button) {
      button.disabled = false;
      updateReleUI(releState.encendido);
    }
    releState.updating = false;
  }
}

// Función para actualizar el estado de conexión en la UI
function updateConnectionStatus(isConnected, errorMessage = null) {
  const deviceStatus = document.getElementById('device-status');
  const deviceCard = document.querySelector('.card[style*="gradient"]');
  
  if (deviceStatus) {
    if (isConnected) {
      deviceStatus.textContent = 'Monitoreando en tiempo real';
      deviceStatus.style.color = 'white';
      if (deviceCard) {
        const statusDot = deviceCard.querySelector('.w-2.h-2.rounded-full');
        if (statusDot) statusDot.style.background = '#10b981';
      }
    } else {
      deviceStatus.textContent = errorMessage || 'Error de conexión';
      deviceStatus.style.color = '#fca5a5';
      if (deviceCard) {
        const statusDot = deviceCard.querySelector('.w-2.h-2.rounded-full');
        if (statusDot) statusDot.style.background = '#ef4444';
      }
    }
  }
}

// Función para actualizar indicadores de estado
function updateStatusIndicators(text) {
  const statsGrid = document.querySelector('.stats-grid');
  if (!statsGrid) return;
  
  const indicators = statsGrid.querySelectorAll('p.text-base');
  indicators.forEach(indicator => {
    if (indicator.textContent.includes('Esperando datos')) {
      indicator.textContent = text;
      indicator.style.color = '#10b981';
      indicator.classList.remove('text-[#6b7280]');
      indicator.classList.add('text-[#10b981]');
    }
  });
}

// Función para manejar alertas de flama
function handleFlameAlert(flamaDetectada, estado) {
  if (flamaDetectada) {
    const now = Date.now();
    if (!lastFlameAlert || (now - lastFlameAlert) > 10000) {
      showNotification('🔥 ALERTA DE FUEGO', 'Sensor de flama ha detectado fuego!', 'danger');
      lastFlameAlert = now;
    }
  }
}

// Función para actualizar indicador de flama
function updateFlameIndicator(flamaDetectada, estado, valorAnalog) {
  let flameAlert = document.getElementById('flame-alert');
  
  if (flamaDetectada) {
    if (!flameAlert) {
      const alertsSection = document.getElementById('alerts-section');
      if (alertsSection) {
        alertsSection.style.display = 'block';
        const container = document.getElementById('alerts-container');
        if (container) {
          flameAlert = document.createElement('div');
          flameAlert.id = 'flame-alert';
          flameAlert.className = 'alert-item';
          container.appendChild(flameAlert);
        }
      }
    }
    
    if (flameAlert) {
      flameAlert.innerHTML = `
        <div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
          <span class="material-symbols-outlined text-red-500 text-2xl">local_fire_department</span>
          <div class="flex-1">
            <p class="font-weight: 600; margin: 0 0 4px 0; color: #1f2937;">${title}</p>
            <p class="text-sm text-red-600 dark:text-red-300">Estado: ${estado} | Valor: ${valorAnalog}</p>
            <p class="text-xs text-red-500 dark:text-red-400 mt-1">Detectado ahora</p>
          </div>
        </div>
      `;
    }
  } else {
    if (flameAlert) {
      flameAlert.remove();
    }
  }
}

// Almacenar historial
let dataHistory = {
  current: [],
  voltage: [],
  power: [],
  timestamps: []
};

function storeDataPoint(current, voltage, power) {
  const now = new Date().toLocaleTimeString();
  
  dataHistory.current.push(current);
  dataHistory.voltage.push(voltage);
  dataHistory.power.push(power);
  dataHistory.timestamps.push(now);
  
  if (dataHistory.current.length > 50) {
    dataHistory.current.shift();
    dataHistory.voltage.shift();
    dataHistory.power.shift();
    dataHistory.timestamps.shift();
  }
}

// Toggle monitoreo
function toggleMonitoring() {
  const button = document.getElementById('toggleMonitoring');
  const icon = button.querySelector('.material-symbols-outlined');
  const text = button.querySelector('span:last-child');
  const deviceStatus = document.getElementById('device-status');
  
  if (!isMonitoring) {
    if (typeof window.ESP32API === 'undefined') {
      showNotification('Error', 'API de ESP32 no está cargada. Recarga la página.', 'danger');
      return;
    }
    
    const ip = window.ESP32API.getESP32IP();
    
    if (!ip || ip === '') {
      showNotification('Error', 'Por favor configura la IP de tu ESP32 primero', 'danger');
      return;
    }
    
    isMonitoring = true;
    monitoringInterval = setInterval(() => {
      updateRealTimeValues();
    }, config.updateInterval);
    
    updateRealTimeValues();
    
    button.style.background = '#ef4444';
    icon.textContent = 'stop';
    text.textContent = 'Detener Monitoreo';
    
    if (deviceStatus) {
      deviceStatus.textContent = 'Conectando...';
    }
    
    showNotification('Monitoreo ESP32 Iniciado', `Conectando a ${ip}...`);
  } else {
    isMonitoring = false;
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      monitoringInterval = null;
    }
    
    button.style.background = '#10b981';
    icon.textContent = 'play_arrow';
    text.textContent = 'Iniciar Monitoreo';
    
    if (deviceStatus) {
      deviceStatus.textContent = 'En espera';
    }
    
    resetDisplayValues();
    
    const flameAlert = document.getElementById('flame-alert');
    if (flameAlert) flameAlert.remove();
    
    showNotification('Monitoreo Detenido', 'ESP32 en espera');
  }
}

// Resetear valores
function resetDisplayValues() {
  const currentElement = document.getElementById('current-value');
  if (currentElement) currentElement.textContent = '-- A';
  
  const voltageElement = document.getElementById('voltage-value');
  if (voltageElement) voltageElement.textContent = '-- V';
  
  const powerElement = document.getElementById('power-value');
  if (powerElement) powerElement.textContent = '-- W';
  
  const costElement = document.getElementById('cost-value');
  if (costElement) costElement.textContent = '$--';
  
  const costTrendElement = document.getElementById('cost-trend');
  if (costTrendElement) {
    costTrendElement.textContent = 'Esperando datos...';
    costTrendElement.style.color = '#6b7280';
  }
  
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    const indicators = statsGrid.querySelectorAll('p.text-base');
    indicators.forEach(indicator => {
      if (indicator.textContent.includes('En tiempo real') || indicator.textContent.includes('Esperando datos')) {
        indicator.textContent = 'Esperando datos...';
        indicator.style.color = '#6b7280';
        indicator.classList.remove('text-[#10b981]');
        indicator.classList.add('text-[#6b7280]');
      }
    });
  }
}

// Notificaciones
function showNotification(title, message, type = 'info') {
  const colors = {
    info: { border: '#3b82f6', icon: '#3b82f6', iconName: 'info' },
    success: { border: '#10b981', icon: '#10b981', iconName: 'check_circle' },
    danger: { border: '#ef4444', icon: '#ef4444', iconName: 'warning' },
    warning: { border: '#f59e0b', icon: '#f59e0b', iconName: 'error' }
  };
  
  const style = colors[type] || colors.info;
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-left: 4px solid ${style.border};
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    min-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: start; gap: 12px;">
      <span class="material-symbols-outlined" style="color: ${style.icon};">${style.iconName}</span>
      <div style="flex: 1;">
        <p style="font-weight: 600; margin: 0 0 4px 0; color: #1f2937;">${title}</p>
        <p style="font-size: 14px; margin: 0; color: #6b7280;">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; cursor: pointer; padding: 0;">
        <span class="material-symbols-outlined" style="color: #9ca3af; font-size: 20px;">close</span>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  const timeout = type === 'danger' ? 8000 : 5000;
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, timeout);
}

// Estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Resto de funciones (IP config, etc.) - SIN CAMBIOS
function saveIPFromMainInput() {
  const input = document.getElementById('esp32-ip-input-main');
  if (!input) return;
  
  const newIP = input.value.trim();
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  
  if (!newIP) {
    showConnectionFeedback('Por favor ingresa una dirección IP', 'error');
    return;
  }
  
  if (!ipPattern.test(newIP)) {
    showConnectionFeedback('Formato de IP inválido. Ejemplo: 192.168.1.100', 'error');
    return;
  }
  
  const parts = newIP.split('.');
  if (parts.some(part => parseInt(part) > 255)) {
    showConnectionFeedback('Los valores de IP deben ser entre 0 y 255', 'error');
    return;
  }
  
  if (window.ESP32API) {
    window.ESP32API.setESP32IP(newIP);
    showConnectionFeedback(`IP guardada correctamente: ${newIP}`, 'success');
    showNotification('IP Actualizada', `Nueva IP configurada: ${newIP}`, 'success');
  } else {
    showConnectionFeedback('Error: API no disponible', 'error');
  }
}

async function testConnectionFromMainButton() {
  if (typeof window.ESP32API === 'undefined') {
    showConnectionFeedback('Error: API no disponible', 'error');
    return;
  }
  
  const ip = window.ESP32API.getESP32IP();
  const button = document.getElementById('test-connection-btn');
  const icon = button ? button.querySelector('.material-symbols-outlined') : null;
  
  showConnectionFeedback('Probando conexión...', 'loading');
  if (icon) {
    icon.style.animation = 'spin 1s linear infinite';
  }
  
  const result = await window.ESP32API.getStatusData();
  
  if (icon) {
    icon.style.animation = '';
  }
  
  if (result.success) {
    showConnectionFeedback(`✅ Conectado exitosamente a ${ip}`, 'success');
    showNotification('Conexión Exitosa', `ESP32 respondió correctamente`, 'success');
    updateConnectionStatusDot(true);
  } else {
    showConnectionFeedback(`❌ Error: ${result.error}`, 'error');
    showNotification('Error de Conexión', result.error || 'No se pudo conectar', 'danger');
    updateConnectionStatusDot(false);
  }
}

function showConnectionFeedback(message, type) {
  const feedback = document.getElementById('connection-feedback');
  if (!feedback) return;
  
  const styles = {
    success: 'background: #d1fae5; color: #065f46; border-left: 4px solid #10b981;',
    error: 'background: #fee2e2; color: #991b1b; border-left: 4px solid #ef4444;',
    loading: 'background: #dbeafe; color: #1e40af; border-left: 4px solid #3b82f6;'
  };
  
  feedback.style.cssText = `
    ${styles[type] || styles.loading}
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
  `;
  feedback.textContent = message;
  feedback.style.display = 'block';
  
  if (type === 'success') {
    setTimeout(() => {
      feedback.style.display = 'none';
    }, 5000);
  }
}

function updateConnectionStatusDot(isConnected) {
  const dot = document.getElementById('connection-status-dot');
  if (dot) {
    dot.style.background = isConnected ? '#10b981' : '#ef4444';
  }
}

function loadSavedIPToInput() {
  const input = document.getElementById('esp32-ip-input-main');
  if (input && window.ESP32API) {
    input.value = window.ESP32API.getESP32IP();
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Dashboard inicializado');
  
  const button = document.getElementById('toggleMonitoring');
  if (button) {
    button.addEventListener('click', toggleMonitoring);
  }
  
  loadSavedIPToInput();
  
  const saveIPBtn = document.getElementById('save-ip-btn');
  if (saveIPBtn) {
    saveIPBtn.addEventListener('click', saveIPFromMainInput);
  }
  
  const testConnBtn = document.getElementById('test-connection-btn');
  if (testConnBtn) {
    testConnBtn.addEventListener('click', testConnectionFromMainButton);
  }
  
  const toggleReleBtn = document.getElementById('toggle-rele-btn');
  if (toggleReleBtn) {
    toggleReleBtn.addEventListener('click', toggleReleState);
  }
  
  const ipInput = document.getElementById('esp32-ip-input-main');
  if (ipInput) {
    ipInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        saveIPFromMainInput();
      }
    });
  }
});

window.addEventListener('beforeunload', function() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
});
