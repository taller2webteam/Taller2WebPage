// ============================================
// MONITOREO EN TIEMPO REAL - ESP32 IoT DEVICE
// ============================================

let isMonitoring = false;
let monitoringInterval = null;

// Configuración
const config = {
  costPerKWh: 3.20,    // Pesos por kWh (ajusta según tu región)
  updateInterval: 2000  // Actualizar cada 2 segundos
};

// Última alerta de flama mostrada
let lastFlameAlert = null;

// Estado del relé
let releState = {
  encendido: false,
  updating: false
};

// Función para actualizar los valores en tiempo real desde la ESP32
async function updateRealTimeValues() {
  // Verificar que la API de ESP32 esté disponible
  if (typeof window.ESP32API === 'undefined') {
    console.error('ESP32API no está disponible');
    showNotification('Error', 'API de ESP32 no está cargada', 'danger');
    return;
  }
  
  console.log('🔄 Obteniendo datos de ESP32...');
  console.log('📍 IP configurada:', window.ESP32API.getESP32IP());
  
  // Obtener datos de sensores
  const result = await window.ESP32API.getSensoresData();
  
  console.log('📦 Resultado:', result);
  
  if (!result.success) {
    // Error al obtener datos
    console.error('❌ Error al obtener datos:', result.error);
    updateConnectionStatus(false, result.error);
    showNotification('Error de Conexión', `No se pudo conectar: ${result.error}`, 'danger');
    return;
  }
  
  console.log('✅ Datos recibidos correctamente');
  const data = result.data;
  
  // Actualizar estado de conexión
  updateConnectionStatus(true);
  
  // 1. Calcular potencia
  const power = Math.abs(data.corriente) * data.voltaje; // Potencia = Voltaje × Corriente
  
  // 2. Calcular costo mensual estimado (basado en uso 24/7)
  const kWhPerDay = (power / 1000) * 24; // kWh por día
  const kWhPerMonth = kWhPerDay * 30;     // kWh por mes
  const monthlyCost = kWhPerMonth * config.costPerKWh;
  
  // 3. Actualizar Corriente
  const currentElement = document.getElementById('current-value');
  if (currentElement) {
    currentElement.textContent = `${Math.abs(data.corriente).toFixed(2)} A`;
  }
  const tableCurrent = document.getElementById('table-current');
  if (tableCurrent) {
    tableCurrent.textContent = `${Math.abs(data.corriente).toFixed(2)} A`;
  }
  
  // 4. Actualizar Voltaje
  const voltageElement = document.getElementById('voltage-value');
  if (voltageElement) {
    voltageElement.textContent = `${data.voltaje.toFixed(1)} V`;
  }
  const tableVoltage = document.getElementById('table-voltage');
  if (tableVoltage) {
    tableVoltage.textContent = `${data.voltaje.toFixed(1)} V`;
  }
  
  // 5. Actualizar Potencia
  const powerElement = document.getElementById('power-value');
  if (powerElement) {
    powerElement.textContent = `${power.toFixed(0)} W`;
  }
  const tablePower = document.getElementById('table-power');
  if (tablePower) {
    tablePower.textContent = `${power.toFixed(0)} W`;
  }
  
  // 6. Actualizar Costo Estimado
  const costElement = document.getElementById('cost-value');
  if (costElement) {
    costElement.textContent = `$${monthlyCost.toFixed(0)}`;
  }
  
  // 7. Actualizar tendencia de costo
  const costTrendElement = document.getElementById('cost-trend');
  if (costTrendElement) {
    costTrendElement.textContent = 'En tiempo real';
    costTrendElement.style.color = '#10b981';
  }
  
  // 8. Actualizar indicadores de estado a "En tiempo real"
  updateStatusIndicators('En tiempo real');
  
  // 8. Manejar alertas de flama
  handleFlameAlert(data.flamaDetectada, data.flamaEstado);
  
  // 9. Actualizar indicador de flama en la UI
  updateFlameIndicator(data.flamaDetectada, data.flamaEstado, data.flamaAnalog);
  
  // 10. Almacenar datos para historial
  storeDataPoint(data.corriente, data.voltaje, power);
  
  // 11. Actualizar estado del relé
  updateReleStatus();
}

// Función para actualizar el estado del relé
async function updateReleStatus() {
  if (typeof window.ESP32API === 'undefined' || !isMonitoring) return;
  
  const result = await window.ESP32API.getReleStatus();
  
  if (result.success) {
    releState.encendido = result.data.encendido;
    updateReleUI(result.data.encendido);
  }
}

// Función para actualizar la UI del relé
function updateReleUI(encendido) {
  const button = document.getElementById('toggle-rele-btn');
  const statusText = document.getElementById('rele-status-text');
  const icon = document.getElementById('rele-icon');
  
  if (button) {
    button.disabled = false;
    
    if (encendido) {
      button.style.background = '#ef4444'; // Rojo para apagar
      button.innerHTML = `
        <span class="material-symbols-outlined text-white text-[20px]">power_settings_new</span>
        <span>Apagar</span>
      `;
    } else {
      button.style.background = '#10b981'; // Verde para encender
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

// Función para toggle del relé
async function toggleReleState() {
  if (releState.updating) return; // Evitar múltiples clics
  
  releState.updating = true;
  const button = document.getElementById('toggle-rele-btn');
  
  if (button) {
    button.disabled = true;
    button.innerHTML = `
      <span class="material-symbols-outlined text-white text-[20px]">hourglass_empty</span>
      <span>Procesando...</span>
    `;
  }
  
  try {
    const result = await window.ESP32API.toggleRele();
    
    if (result.success) {
      releState.encendido = result.data.encendido;
      updateReleUI(result.data.encendido);
      
      const action = result.data.encendido ? 'encendido' : 'apagado';
      showNotification('Relé Actualizado', `El relé ha sido ${action}`, 'success');
    } else {
      showNotification('Error', 'No se pudo cambiar el estado del relé', 'danger');
      
      // Restaurar botón
      if (button) {
        button.disabled = false;
        updateReleUI(releState.encendido);
      }
    }
  } catch (error) {
    showNotification('Error', 'Error al comunicarse con el ESP32', 'danger');
    
    // Restaurar botón
    if (button) {
      button.disabled = false;
      updateReleUI(releState.encendido);
    }
  } finally {
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

// Función para actualizar indicadores de estado bajo las métricas
function updateStatusIndicators(text) {
  // Buscar todos los elementos <p> que están bajo las tarjetas de stats
  const statsGrid = document.querySelector('.stats-grid');
  if (!statsGrid) return;
  
  const indicators = statsGrid.querySelectorAll('p.text-base');
  indicators.forEach(indicator => {
    // Solo actualizar los que dicen "Esperando datos..."
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
    // Solo mostrar alerta si han pasado al menos 10 segundos desde la última
    const now = Date.now();
    if (!lastFlameAlert || (now - lastFlameAlert) > 10000) {
      showNotification('🔥 ALERTA DE FUEGO', 'Sensor de flama ha detectado fuego!', 'danger');
      lastFlameAlert = now;
    }
  }
}

// Función para actualizar indicador de flama en la UI
function updateFlameIndicator(flamaDetectada, estado, valorAnalog) {
  // Buscar o crear sección de alerta de flama
  let flameAlert = document.getElementById('flame-alert');
  
  if (flamaDetectada) {
    if (!flameAlert) {
      // Crear alerta de flama
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
            <p class="font-bold text-red-700 dark:text-red-400">ALERTA DE FUEGO</p>
            <p class="text-sm text-red-600 dark:text-red-300">Estado: ${estado} | Valor: ${valorAnalog}</p>
            <p class="text-xs text-red-500 dark:text-red-400 mt-1">Detectado ahora</p>
          </div>
        </div>
      `;
    }
  } else {
    // Remover alerta si existe
    if (flameAlert) {
      flameAlert.remove();
    }
  }
}

// Almacenar historial de datos para posibles gráficas
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
  
  // Mantener solo los últimos 50 puntos
  if (dataHistory.current.length > 50) {
    dataHistory.current.shift();
    dataHistory.voltage.shift();
    dataHistory.power.shift();
    dataHistory.timestamps.shift();
  }
}

// Función para toggle del monitoreo
function toggleMonitoring() {
  const button = document.getElementById('toggleMonitoring');
  const icon = button.querySelector('.material-symbols-outlined');
  const text = button.querySelector('span:last-child');
  const deviceStatus = document.getElementById('device-status');
  
  if (!isMonitoring) {
    // Verificar que la API esté disponible
    if (typeof window.ESP32API === 'undefined') {
      showNotification('Error', 'API de ESP32 no está cargada. Recarga la página.', 'danger');
      console.error('❌ ESP32API no está definida');
      return;
    }
    
    const ip = window.ESP32API.getESP32IP();
    console.log('🚀 Iniciando monitoreo...');
    console.log('📍 IP ESP32:', ip);
    
    // Verificar que haya una IP configurada
    if (!ip || ip === '') {
      showNotification('Error', 'Por favor configura la IP de tu ESP32 primero', 'danger');
      console.error('❌ No hay IP configurada');
      return;
    }
    
    // Iniciar monitoreo
    isMonitoring = true;
    monitoringInterval = setInterval(() => {
      updateRealTimeValues();
    }, config.updateInterval);
    
    // Primera actualización inmediata
    console.log('📡 Primera actualización inmediata...');
    updateRealTimeValues();
    
    // Actualizar botón
    button.style.background = '#ef4444';
    icon.textContent = 'stop';
    text.textContent = 'Detener Monitoreo';
    
    // Actualizar estado del dispositivo
    if (deviceStatus) {
      deviceStatus.textContent = 'Conectando...';
    }
    
    // Mostrar notificación
    showNotification('Monitoreo ESP32 Iniciado', `Conectando a ${ip}...`);
  } else {
    // Detener monitoreo
    isMonitoring = false;
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      monitoringInterval = null;
    }
    
    // Actualizar botón
    button.style.background = '#10b981';
    icon.textContent = 'play_arrow';
    text.textContent = 'Iniciar Monitoreo';
    
    // Actualizar estado del dispositivo
    if (deviceStatus) {
      deviceStatus.textContent = 'En espera';
    }
    
    // Resetear valores a estado inicial
    resetDisplayValues();
    
    // Limpiar alertas de flama
    const flameAlert = document.getElementById('flame-alert');
    if (flameAlert) flameAlert.remove();
    
    // Mostrar notificación
    showNotification('Monitoreo Detenido', 'ESP32 en espera');
  }
}

// Función para resetear los valores mostrados
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
  
  // Resetear indicadores de estado
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
}

// Función para mostrar notificaciones
function showNotification(title, message, type = 'info') {
  // Definir colores según el tipo
  const colors = {
    info: { border: '#3b82f6', icon: '#3b82f6', iconName: 'info' },
    success: { border: '#10b981', icon: '#10b981', iconName: 'check_circle' },
    danger: { border: '#ef4444', icon: '#ef4444', iconName: 'warning' },
    warning: { border: '#f59e0b', icon: '#f59e0b', iconName: 'error' }
  };
  
  const style = colors[type] || colors.info;
  
  // Crear elemento de notificación
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
  
  // Auto-remover después de 5 segundos (o 8 segundos para alertas de peligro)
  const timeout = type === 'danger' ? 8000 : 5000;
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, timeout);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Función para mostrar diálogo de configuración de IP
function showIPConfigDialog() {
  // Verificar si ya existe el diálogo
  let dialog = document.getElementById('ip-config-dialog');
  if (dialog) {
    dialog.style.display = 'flex';
    return;
  }
  
  // Crear diálogo
  dialog = document.createElement('div');
  dialog.id = 'ip-config-dialog';
  dialog.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
  `;
  
  const currentIP = window.ESP32API ? window.ESP32API.getESP32IP() : '192.168.1.100';
  
  dialog.innerHTML = `
    <div style="background: white; padding: 24px; border-radius: 12px; max-width: 400px; width: 90%;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <span class="material-symbols-outlined" style="color: #3b82f6; font-size: 28px;">router</span>
        <h3 style="margin: 0; color: #1f2937; font-size: 20px;">Configurar ESP32</h3>
      </div>
      <p style="color: #6b7280; margin-bottom: 20px;">Ingresa la dirección IP de tu ESP32 IoT Device</p>
      <label style="display: block; margin-bottom: 8px; color: #374151; font-weight: 500;">Dirección IP:</label>
      <input type="text" id="esp32-ip-input" value="${currentIP}" 
        placeholder="192.168.1.100" 
        style="width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; margin-bottom: 20px; box-sizing: border-box;">
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button id="cancel-ip-config" style="padding: 10px 20px; background: #e5e7eb; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; color: #374151;">
          Cancelar
        </button>
        <button id="save-ip-config" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
          Guardar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // Event listeners
  document.getElementById('cancel-ip-config').addEventListener('click', () => {
    dialog.style.display = 'none';
  });
  
  document.getElementById('save-ip-config').addEventListener('click', () => {
    const newIP = document.getElementById('esp32-ip-input').value.trim();
    if (newIP && window.ESP32API) {
      window.ESP32API.setESP32IP(newIP);
      showNotification('IP Actualizada', `Nueva IP configurada: ${newIP}`, 'success');
      dialog.style.display = 'none';
    } else {
      showNotification('Error', 'Por favor ingresa una IP válida', 'danger');
    }
  });
  
  // Cerrar con ESC
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dialog.style.display = 'none';
    }
  });
  
  // Cerrar al hacer clic fuera
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.style.display = 'none';
    }
  });
}

// Función para guardar IP desde el input principal
function saveIPFromMainInput() {
  const input = document.getElementById('esp32-ip-input-main');
  if (!input) return;
  
  const newIP = input.value.trim();
  
  // Validar formato de IP básico
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!newIP) {
    showConnectionFeedback('Por favor ingresa una dirección IP', 'error');
    return;
  }
  
  if (!ipPattern.test(newIP)) {
    showConnectionFeedback('Formato de IP inválido. Ejemplo: 192.168.1.100', 'error');
    return;
  }
  
  // Validar rangos
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

// Función para probar conexión desde el botón principal
async function testConnectionFromMainButton() {
  if (typeof window.ESP32API === 'undefined') {
    showConnectionFeedback('Error: API no disponible', 'error');
    console.error('❌ ESP32API no está definida');
    return;
  }
  
  const ip = window.ESP32API.getESP32IP();
  console.log('🧪 Probando conexión a:', ip);
  
  const button = document.getElementById('test-connection-btn');
  const icon = button ? button.querySelector('.material-symbols-outlined') : null;
  
  // Mostrar cargando
  showConnectionFeedback('Probando conexión...', 'loading');
  if (icon) {
    icon.style.animation = 'spin 1s linear infinite';
  }
  
  // Intentar conectar
  console.log('📡 Enviando petición a /status...');
  const result = await window.ESP32API.getStatusData();
  
  console.log('📦 Respuesta de prueba:', result);
  
  // Detener animación
  if (icon) {
    icon.style.animation = '';
  }
  
  if (result.success) {
    console.log('✅ Conexión exitosa!');
    showConnectionFeedback(`✅ Conectado exitosamente a ${ip}`, 'success');
    showNotification('Conexión Exitosa', `ESP32 respondió correctamente`, 'success');
    
    // Actualizar estado visual
    updateConnectionStatusDot(true);
  } else {
    console.error('❌ Error de conexión:', result.error);
    showConnectionFeedback(`❌ Error: ${result.error}`, 'error');
    showNotification('Error de Conexión', result.error || 'No se pudo conectar', 'danger');
    
    // Actualizar estado visual
    updateConnectionStatusDot(false);
  }
}

// Función para mostrar feedback de conexión
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
  
  // Auto-ocultar después de 5 segundos si es success
  if (type === 'success') {
    setTimeout(() => {
      feedback.style.display = 'none';
    }, 5000);
  }
}

// Función para actualizar el punto de estado de conexión
function updateConnectionStatusDot(isConnected) {
  const dot = document.getElementById('connection-status-dot');
  if (dot) {
    dot.style.background = isConnected ? '#10b981' : '#ef4444';
  }
}

// Función para cargar IP guardada en el input al cargar la página
function loadSavedIPToInput() {
  const input = document.getElementById('esp32-ip-input-main');
  if (input && window.ESP32API) {
    input.value = window.ESP32API.getESP32IP();
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('toggleMonitoring');
  if (button) {
    button.addEventListener('click', toggleMonitoring);
  }
  
  // Cargar IP guardada en el input
  loadSavedIPToInput();
  
  // Event listener para guardar IP
  const saveIPBtn = document.getElementById('save-ip-btn');
  if (saveIPBtn) {
    saveIPBtn.addEventListener('click', saveIPFromMainInput);
  }
  
  // Event listener para probar conexión
  const testConnBtn = document.getElementById('test-connection-btn');
  if (testConnBtn) {
    testConnBtn.addEventListener('click', testConnectionFromMainButton);
  }
  
  // Event listener para toggle del relé
  const toggleReleBtn = document.getElementById('toggle-rele-btn');
  if (toggleReleBtn) {
    toggleReleBtn.addEventListener('click', toggleReleState);
  }
  
  // Permitir guardar con Enter en el input
  const ipInput = document.getElementById('esp32-ip-input-main');
  if (ipInput) {
    ipInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        saveIPFromMainInput();
      }
    });
  }
});

// Limpiar al salir de la página
window.addEventListener('beforeunload', function() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
});

