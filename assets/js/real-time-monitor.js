// ============================================
// MONITOREO EN TIEMPO REAL - ESP32 ENTRADA PRUEBA
// ============================================

let isMonitoring = false;
let monitoringInterval = null;

// Valores base para el ESP32 (consumo reducido)
const baseValues = {
  current: 0.15,      // Amperios (consumo bajo)
  voltage: 120,       // Voltios (estándar residencial)
  power: 18,          // Watts (calculado: V * A)
  costPerKWh: 3.20    // Pesos por kWh (ajusta según tu región)
};

// Función para generar variación consistente y realista
function generateConsistentValue(baseValue, time, variance = 0.05, frequency = 10) {
  // Usa funciones sinusoidales para simular variaciones naturales
  const timeInSeconds = Date.now() / 1000;
  const wave1 = Math.sin(timeInSeconds / frequency) * variance;
  const wave2 = Math.sin(timeInSeconds / (frequency * 3)) * (variance / 2);
  const wave3 = Math.sin(timeInSeconds / (frequency * 7)) * (variance / 3);
  const variation = wave1 + wave2 + wave3;
  
  return baseValue * (1 + variation);
}

// Función para actualizar los valores en tiempo real
function updateRealTimeValues() {
  const time = Date.now();
  
  // 1. Generar valores con variaciones realistas
  const current = generateConsistentValue(baseValues.current, time, 0.08, 8);  // Varía ±8%
  const voltage = generateConsistentValue(baseValues.voltage, time, 0.02, 15); // Varía ±2% (más estable)
  const power = current * voltage; // Potencia = Voltaje × Corriente
  
  // 2. Calcular costo mensual estimado (basado en uso 24/7)
  const kWhPerDay = (power / 1000) * 24; // kWh por día
  const kWhPerMonth = kWhPerDay * 30;     // kWh por mes
  const monthlyCost = kWhPerMonth * baseValues.costPerKWh;
  
  // 3. Actualizar Corriente
  const currentElement = document.getElementById('current-value');
  if (currentElement) {
    currentElement.textContent = `${current.toFixed(2)} A`;
  }
  const tableCurrent = document.getElementById('table-current');
  if (tableCurrent) {
    tableCurrent.textContent = `${current.toFixed(2)} A`;
  }
  
  // 4. Actualizar Voltaje
  const voltageElement = document.getElementById('voltage-value');
  if (voltageElement) {
    voltageElement.textContent = `${voltage.toFixed(1)} V`;
  }
  const tableVoltage = document.getElementById('table-voltage');
  if (tableVoltage) {
    tableVoltage.textContent = `${voltage.toFixed(1)} V`;
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
    const baseMonthlyCost = (baseValues.power / 1000) * 24 * 30 * baseValues.costPerKWh;
    const costDiff = monthlyCost - baseMonthlyCost;
    const costDiffPercent = (costDiff / baseMonthlyCost) * 100;
    
    if (Math.abs(costDiffPercent) > 1) {
      const sign = costDiff >= 0 ? '+' : '';
      costTrendElement.textContent = `${sign}${costDiffPercent.toFixed(1)}% vs promedio`;
      costTrendElement.style.color = costDiff >= 0 ? '#fa6238' : '#0bda5b';
    } else {
      costTrendElement.textContent = 'Estable';
      costTrendElement.style.color = '#3b82f6';
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
    // Iniciar monitoreo
    isMonitoring = true;
    monitoringInterval = setInterval(() => {
      updateRealTimeValues();
    }, 1500); // Actualizar cada 1.5 segundos
    
    // Primera actualización inmediata
    updateRealTimeValues();
    
    // Actualizar botón
    button.style.background = '#ef4444';
    icon.textContent = 'stop';
    text.textContent = 'Detener Monitoreo';
    
    // Actualizar estado del dispositivo
    if (deviceStatus) {
      deviceStatus.textContent = 'Monitoreando en tiempo real';
    }
    
    // Mostrar notificación
    showNotification('Monitoreo ESP32 Iniciado', 'Midiendo corriente, voltaje y potencia en tiempo real');
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
    
    // Mostrar notificación
    showNotification('Monitoreo Detenido', 'ESP32 en espera');
  }
}

// Función para mostrar notificaciones
function showNotification(title, message) {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-left: 4px solid #3b82f6;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    min-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: start; gap: 12px;">
      <span class="material-symbols-outlined" style="color: #3b82f6;">info</span>
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
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('toggleMonitoring');
  if (button) {
    button.addEventListener('click', toggleMonitoring);
  }
});

// Limpiar al salir de la página
window.addEventListener('beforeunload', function() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
});

