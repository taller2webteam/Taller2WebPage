// ============================================
// MONITOR DE DISPOSITIVOS - ESP32 IoT Device
// ============================================

let updateInterval = null;

// Función para actualizar todos los datos de la página de dispositivos
async function updateDevicesData() {
  if (typeof window.ESP32API === 'undefined') {
    console.error('ESP32API no está disponible');
    return;
  }
  
  // Obtener datos de sensores
  const sensoresResult = await window.ESP32API.getSensoresData();
  
  // Obtener estado del sistema
  const statusResult = await window.ESP32API.getStatusData();
  
  // Actualizar estado de conexión ESP32
  if (sensoresResult.success || statusResult.success) {
    updateESP32Status(true);
  } else {
    updateESP32Status(false);
  }
  
  // Actualizar datos de sensores
  if (sensoresResult.success) {
    updateSensorData(sensoresResult.data);
  }
  
  // Actualizar estado del sistema
  if (statusResult.success) {
    updateSystemStatus(statusResult.data);
  }
}

// Actualizar estado de conexión de la ESP32
function updateESP32Status(isOnline) {
  const statusDot = document.getElementById('esp32-status-dot');
  const statusText = document.getElementById('esp32-status-text');
  const ipElement = document.getElementById('esp32-ip');
  
  if (statusDot) {
    statusDot.className = `size-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`;
  }
  
  if (statusText) {
    statusText.textContent = isOnline ? 'Online' : 'Offline';
    statusText.className = `text-sm ${isOnline ? 'text-green-500' : 'text-red-500'}`;
  }
  
  if (ipElement && window.ESP32API) {
    ipElement.textContent = window.ESP32API.getESP32IP();
  }
}

// Actualizar datos de sensores
function updateSensorData(data) {
  // Actualizar corriente
  const currentElement = document.getElementById('device-current');
  if (currentElement) {
    currentElement.textContent = `${Math.abs(data.corriente).toFixed(2)} A`;
  }
  
  // Actualizar voltaje
  const voltageElement = document.getElementById('device-voltage');
  if (voltageElement) {
    voltageElement.textContent = `${data.voltaje.toFixed(1)} V`;
  }
  
  // Actualizar potencia
  const powerElement = document.getElementById('device-power');
  if (powerElement) {
    const power = Math.abs(data.corriente) * data.voltaje;
    powerElement.textContent = `${power.toFixed(0)} W`;
  }
  
  // Actualizar estado de flama
  const flameStatusElement = document.getElementById('flame-status');
  const flameDescElement = document.getElementById('flame-description');
  const flameAnalogElement = document.getElementById('flame-analog');
  
  if (flameStatusElement) {
    if (data.flamaDetectada) {
      flameStatusElement.textContent = '🔥 ALERTA';
      flameStatusElement.style.color = '#ef4444';
    } else {
      flameStatusElement.textContent = 'OK';
      flameStatusElement.style.color = '#10b981';
    }
  }
  
  if (flameDescElement) {
    flameDescElement.textContent = data.flamaDetectada 
      ? '¡Fuego detectado!' 
      : 'Sin detección de fuego';
  }
  
  if (flameAnalogElement) {
    flameAnalogElement.textContent = data.flamaAnalog;
  }
}

// Actualizar estado del sistema
function updateSystemStatus(data) {
  // Actualizar uptime
  const uptimeElement = document.getElementById('system-uptime');
  if (uptimeElement) {
    const seconds = Math.floor(data.uptime / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    uptimeElement.textContent = `${hours}h ${minutes}m`;
  }
  
  // Actualizar memoria libre
  const heapElement = document.getElementById('system-heap');
  if (heapElement) {
    const heapKB = (data.freeHeap / 1024).toFixed(1);
    heapElement.textContent = `${heapKB} KB`;
  }
  
  // Actualizar RSSI
  const rssiElement = document.getElementById('system-rssi');
  if (rssiElement) {
    rssiElement.textContent = `${data.rssi} dBm`;
  }
  
  // Actualizar SSID
  const ssidElement = document.getElementById('system-ssid');
  if (ssidElement) {
    ssidElement.textContent = data.ssid;
  }
}

// Función para probar conexión
async function testESP32Connection() {
  if (typeof window.ESP32API === 'undefined') {
    alert('ESP32API no está disponible');
    return;
  }
  
  const button = event.target.closest('button');
  const icon = button.querySelector('.material-symbols-outlined');
  
  // Animación de carga
  icon.style.animation = 'spin 1s linear infinite';
  
  const result = await window.ESP32API.getStatusData();
  
  // Detener animación
  icon.style.animation = '';
  
  if (result.success) {
    showNotification('Conexión Exitosa', `Conectado a ESP32 en ${window.ESP32API.getESP32IP()}`, 'success');
    updateDevicesData();
  } else {
    showNotification('Error de Conexión', result.error || 'No se pudo conectar con la ESP32', 'danger');
  }
}

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
      
      // Actualizar IP en la UI
      const ipElement = document.getElementById('esp32-ip');
      if (ipElement) ipElement.textContent = newIP;
      
      // Probar conexión
      testESP32Connection();
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

// Función para mostrar notificaciones
function showNotification(title, message, type = 'info') {
  const colors = {
    info: { border: '#3b82f6', icon: '#3b82f6', iconName: 'info' },
    success: { border: '#10b981', icon: '#10b981', iconName: 'check_circle' },
    danger: { border: '#ef4444', icon: '#ef4444', iconName: 'warning' }
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
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Agregar estilos de animación
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

// Función para guardar IP desde devices.html
function saveIPFromDevicesInput() {
  const input = document.getElementById('esp32-ip-input-devices');
  if (!input) return;
  
  const newIP = input.value.trim();
  
  // Validar formato de IP básico
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!newIP) {
    showDevicesFeedback('Por favor ingresa una dirección IP', 'error');
    return;
  }
  
  if (!ipPattern.test(newIP)) {
    showDevicesFeedback('Formato de IP inválido. Ejemplo: 192.168.1.100', 'error');
    return;
  }
  
  // Validar rangos
  const parts = newIP.split('.');
  if (parts.some(part => parseInt(part) > 255)) {
    showDevicesFeedback('Los valores de IP deben ser entre 0 y 255', 'error');
    return;
  }
  
  if (window.ESP32API) {
    window.ESP32API.setESP32IP(newIP);
    showDevicesFeedback(`✅ IP guardada: ${newIP}`, 'success');
    showNotification('IP Actualizada', `Nueva IP configurada: ${newIP}`, 'success');
    
    // Actualizar IP mostrada
    const ipElement = document.getElementById('esp32-ip');
    if (ipElement) ipElement.textContent = newIP;
  } else {
    showDevicesFeedback('❌ Error: API no disponible', 'error');
  }
}

// Función para probar conexión desde devices.html
async function testConnectionFromDevicesButton() {
  if (typeof window.ESP32API === 'undefined') {
    showDevicesFeedback('❌ Error: API no disponible', 'error');
    return;
  }
  
  const button = document.getElementById('test-connection-devices-btn');
  const icon = button ? button.querySelector('.material-symbols-outlined') : null;
  
  // Mostrar cargando
  showDevicesFeedback('🔄 Probando conexión...', 'loading');
  if (icon) {
    icon.style.animation = 'spin 1s linear infinite';
  }
  
  // Intentar conectar
  const result = await window.ESP32API.getStatusData();
  
  // Detener animación
  if (icon) {
    icon.style.animation = '';
  }
  
  if (result.success) {
    showDevicesFeedback(`✅ Conectado a ${window.ESP32API.getESP32IP()}`, 'success');
    showNotification('Conexión Exitosa', 'ESP32 respondió correctamente', 'success');
    
    // Actualizar datos inmediatamente
    updateDevicesData();
  } else {
    showDevicesFeedback(`❌ Error: ${result.error}`, 'error');
    showNotification('Error de Conexión', result.error || 'No se pudo conectar', 'danger');
  }
}

// Función para mostrar feedback en devices.html
function showDevicesFeedback(message, type) {
  const feedback = document.getElementById('connection-feedback-devices');
  if (!feedback) return;
  
  const styles = {
    success: 'background: #d1fae5; color: #065f46; border-left: 4px solid #10b981;',
    error: 'background: #fee2e2; color: #991b1b; border-left: 4px solid #ef4444;',
    loading: 'background: #dbeafe; color: #1e40af; border-left: 4px solid #3b82f6;'
  };
  
  feedback.style.cssText = `
    ${styles[type] || styles.loading}
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    display: block;
  `;
  feedback.textContent = message;
  
  // Auto-ocultar después de 5 segundos si es success
  if (type === 'success') {
    setTimeout(() => {
      feedback.style.display = 'none';
    }, 5000);
  }
}

// Función para cargar IP guardada en el input
function loadSavedIPToDevicesInput() {
  const input = document.getElementById('esp32-ip-input-devices');
  if (input && window.ESP32API) {
    input.value = window.ESP32API.getESP32IP();
  }
  
  const ipElement = document.getElementById('esp32-ip');
  if (ipElement && window.ESP32API) {
    ipElement.textContent = window.ESP32API.getESP32IP();
  }
}

// Iniciar monitoreo al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Cargar IP guardada
  loadSavedIPToDevicesInput();
  
  // Event listeners para devices.html
  const saveIPBtn = document.getElementById('save-ip-devices-btn');
  if (saveIPBtn) {
    saveIPBtn.addEventListener('click', saveIPFromDevicesInput);
  }
  
  const testConnBtn = document.getElementById('test-connection-devices-btn');
  if (testConnBtn) {
    testConnBtn.addEventListener('click', testConnectionFromDevicesButton);
  }
  
  // Permitir guardar con Enter
  const ipInput = document.getElementById('esp32-ip-input-devices');
  if (ipInput) {
    ipInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        saveIPFromDevicesInput();
      }
    });
  }
  
  // Actualizar cada 3 segundos
  updateInterval = setInterval(updateDevicesData, 3000);
  
  // Primera actualización inmediata
  updateDevicesData();
});

// Limpiar al salir de la página
window.addEventListener('beforeunload', function() {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});

