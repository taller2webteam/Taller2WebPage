// ============================================
// MONITOR DE CONSUMO - ESP32 IoT Device
// ============================================

let consumoData = {
  currentPower: 0,
  dailyConsumption: 0,
  monthlyConsumption: 0,
  estimatedCost: 0,
  history24h: [],
  history7d: []
};

const costPerKWh = 3.20; // Pesos por kWh

// Función para actualizar datos de consumo
async function updateConsumoData() {
  if (typeof window.ESP32API === 'undefined') {
    console.error('ESP32API no está disponible');
    return;
  }
  
  const result = await window.ESP32API.getCorrienteData();
  
  if (!result.success) {
    console.error('Error al obtener datos de consumo:', result.error);
    return;
  }
  
  const data = result.data;
  
  // Actualizar potencia actual
  consumoData.currentPower = data.potencia || (Math.abs(data.corriente) * data.voltaje);
  
  // Calcular consumo diario (kWh)
  consumoData.dailyConsumption = (consumoData.currentPower / 1000) * 24;
  
  // Calcular consumo mensual (kWh)
  consumoData.monthlyConsumption = consumoData.dailyConsumption * 30;
  
  // Calcular costo estimado
  consumoData.estimatedCost = consumoData.monthlyConsumption * costPerKWh;
  
  // Actualizar UI
  updateConsumoUI();
}

// Función para actualizar la UI
function updateConsumoUI() {
  // Actualizar potencia actual
  const powerElement = document.getElementById('current-power');
  if (powerElement) {
    powerElement.innerHTML = `<strong>${consumoData.currentPower.toFixed(0)} W</strong>`;
  }
  
  // Actualizar consumo diario
  const dailyElement = document.getElementById('daily-consumption');
  if (dailyElement) {
    dailyElement.innerHTML = `<strong>${consumoData.dailyConsumption.toFixed(2)} kWh</strong>`;
  }
  
  // Actualizar consumo mensual
  const monthlyElement = document.getElementById('monthly-consumption');
  if (monthlyElement) {
    monthlyElement.innerHTML = `<strong>${consumoData.monthlyConsumption.toFixed(1)} kWh</strong>`;
  }
  
  // Actualizar costo estimado
  const costElement = document.getElementById('monthly-cost');
  if (costElement) {
    costElement.innerHTML = `<strong>$ ${consumoData.estimatedCost.toFixed(2)}</strong>`;
  }
  
  // Actualizar estado a "En tiempo real"
  const statusElement = document.getElementById('power-status');
  if (statusElement && statusElement.textContent.includes('Esperando datos')) {
    statusElement.textContent = 'En tiempo real';
    statusElement.style.color = '#10b981';
  }
}

// Iniciar monitoreo automático al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Actualizar cada 5 segundos
  setInterval(updateConsumoData, 5000);
  
  // Primera actualización inmediata
  updateConsumoData();
});

