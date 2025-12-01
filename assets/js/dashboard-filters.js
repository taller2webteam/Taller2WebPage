// ============================================
// FILTROS INTERACTIVOS DEL DASHBOARD
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Verificar que los datos estén disponibles
  if (!window.dashboardData) {
    console.error('Dashboard data not loaded');
    return;
  }

  // Estado actual de los filtros
  let currentPeriod = '24h';
  let currentDeviceType = 'Todos los Dispositivos';

  // Elementos del DOM
  const periodButtons = document.querySelectorAll('.filter-bar .filters .btn');
  const deviceSelect = document.querySelector('.filter-select');
  const statsGrid = document.querySelector('.stats-grid');
  const topDevicesTable = document.querySelector('tbody');

  // Inicializar filtros
  initializePeriodFilters();
  initializeDeviceFilter();
  initializeAlertsSection();
  updateDashboard();

  // ============================================
  // FILTROS DE PERÍODO
  // ============================================
  function initializePeriodFilters() {
    periodButtons.forEach((btn, index) => {
      btn.addEventListener('click', function() {
        // Remover clase active de todos los botones
        periodButtons.forEach(b => b.classList.remove('btn-primary'));
        
        // Agregar clase active al botón clickeado
        this.classList.add('btn-primary');
        
        // Actualizar período actual
        if (index === 0) currentPeriod = '24h';
        else if (index === 1) currentPeriod = '7d';
        else if (index === 2) currentPeriod = '30d';
        
        // Actualizar dashboard
        updateDashboard();
      });
    });
  }

  // ============================================
  // FILTRO DE DISPOSITIVOS
  // ============================================
  function initializeDeviceFilter() {
    deviceSelect.addEventListener('change', function() {
      currentDeviceType = this.value;
      updateDashboard();
    });
  }

  // ============================================
  // ACTUALIZAR DASHBOARD
  // ============================================
  function updateDashboard() {
    updateStats();
    updateTopDevicesTable();
    updateDistribution();
  }

  // ============================================
  // ACTUALIZAR ESTADÍSTICAS
  // ============================================
  function updateStats() {
    const periodData = window.dashboardData.historical[currentPeriod];
    const typeStats = window.dashboardData.getStatsByType(currentDeviceType);
    
    // Actualizar las tarjetas de estadísticas
    const statCards = statsGrid.querySelectorAll('div');
    
    // Tarjeta 1: Consumo Energético Total
    if (statCards[0]) {
      const consumptionValue = statCards[0].querySelector('.text-3xl');
      const consumptionTrend = statCards[0].querySelector('.text-\\[\\#0bda5b\\], .text-\\[\\#fa6238\\]');
      
      if (currentDeviceType === 'Todos los Dispositivos') {
        consumptionValue.textContent = `${periodData.totalConsumption.toLocaleString()} kWh`;
        consumptionTrend.textContent = `${periodData.trend} vs período anterior`;
      } else {
        consumptionValue.textContent = `${typeStats.totalConsumption} kWh`;
        consumptionTrend.textContent = `${typeStats.totalDevices} dispositivos`;
      }
    }
    
    // Tarjeta 2: Dispositivos en Línea
    if (statCards[1]) {
      const devicesValue = statCards[1].querySelector('.text-3xl');
      const devicesTrend = statCards[1].querySelector('.text-\\[\\#0bda5b\\]');
      
      if (currentDeviceType === 'Todos los Dispositivos') {
        devicesValue.textContent = `${periodData.devicesOnline}/${periodData.devicesTotal}`;
        devicesTrend.textContent = `${((periodData.devicesOnline / periodData.devicesTotal) * 100).toFixed(1)}% activos`;
      } else {
        devicesValue.textContent = `${typeStats.onlineDevices}/${typeStats.totalDevices}`;
        devicesTrend.textContent = `${((typeStats.onlineDevices / typeStats.totalDevices) * 100).toFixed(1)}% activos`;
      }
    }
    
    // Tarjeta 3: Alertas Recientes
    if (statCards[2]) {
      const alertsValue = statCards[2].querySelector('.text-3xl');
      const alertsTrend = statCards[2].querySelector('.text-\\[\\#fa6238\\]');
      
      alertsValue.textContent = periodData.alerts;
      
      let changePercent = 0;
      if (currentPeriod === '24h') changePercent = -5.0;
      else if (currentPeriod === '7d') changePercent = +2.3;
      else changePercent = +8.5;
      
      alertsTrend.textContent = `${changePercent > 0 ? '+' : ''}${changePercent}%`;
      alertsTrend.className = changePercent > 0 ? 'text-[#fa6238] text-base font-medium leading-normal font-display' : 'text-[#0bda5b] text-base font-medium leading-normal font-display';
    }
  }

  // ============================================
  // ACTUALIZAR TABLA DE TOP DISPOSITIVOS
  // ============================================
  function updateTopDevicesTable() {
    if (!topDevicesTable) return;
    
    const topDevices = window.dashboardData.getTopDevices(5, currentDeviceType);
    
    // Limpiar tabla
    topDevicesTable.innerHTML = '';
    
    // Agregar filas
    topDevices.forEach((device, index) => {
      const row = document.createElement('tr');
      row.className = index < topDevices.length - 1 ? 'border-b border-gray-200 dark:border-[#324d67]' : '';
      
      // Determinar badge de estado
      let statusBadge = '';
      if (device.status === 'online') {
        statusBadge = '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">En línea</span>';
      } else if (device.status === 'offline') {
        statusBadge = '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Fuera de línea</span>';
      } else {
        statusBadge = '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Advertencia</span>';
      }
      
      row.innerHTML = `
        <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">${device.id}</td>
        <td class="px-4 py-3 text-gray-600 dark:text-gray-300">${device.type}</td>
        <td class="px-4 py-3 text-gray-600 dark:text-gray-300">
          <div class="flex flex-col">
            <span>${device.reading}</span>
            <span class="text-xs text-gray-500">${device.location}</span>
          </div>
        </td>
        <td class="px-4 py-3 text-right">
          <div class="flex flex-col items-end">
            <span class="font-semibold text-gray-900 dark:text-white">${device.consumption.toFixed(1)} kWh</span>
            <span class="text-xs text-gray-500">Actualizado hace ${device.lastUpdate}</span>
          </div>
        </td>
      `;
      
      topDevicesTable.appendChild(row);
    });
  }

  // ============================================
  // ACTUALIZAR DISTRIBUCIÓN
  // ============================================
  function updateDistribution() {
    const distributionCard = document.querySelector('.dashboard-grid .span-2');
    if (!distributionCard) return;
    
    const legendGrid = distributionCard.querySelector('.grid-cols-2');
    if (!legendGrid) return;
    
    // Obtener datos de distribución
    const distData = currentDeviceType === 'Todos los Dispositivos' 
      ? window.dashboardData.distribution['all']
      : window.dashboardData.distribution[currentDeviceType] || window.dashboardData.distribution['all'];
    
    // Actualizar leyenda
    legendGrid.innerHTML = '';
    distData.forEach(item => {
      const legendItem = document.createElement('div');
      legendItem.className = 'flex items-center gap-2';
      legendItem.innerHTML = `
        <span class="w-3 h-3 rounded-full" style="background-color: ${item.color}"></span>
        <span>${item.type} (${item.percentage}%)</span>
      `;
      legendGrid.appendChild(legendItem);
    });
  }

  // ============================================
  // AGREGAR INFORMACIÓN DE FILTRO ACTIVO
  // ============================================
  function addFilterInfo() {
    const container = document.querySelector('.container');
    const filterBar = document.querySelector('.filter-bar');
    
    // Crear elemento de información si no existe
    let filterInfo = document.getElementById('filter-info');
    if (!filterInfo) {
      filterInfo = document.createElement('div');
      filterInfo.id = 'filter-info';
      filterInfo.className = 'filter-info';
      filterInfo.style.cssText = 'padding: 12px 16px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;';
      
      if (filterBar && filterBar.nextSibling) {
        container.insertBefore(filterInfo, filterBar.nextSibling);
      }
    }
    
    // Actualizar contenido
    const periodText = currentPeriod === '24h' ? 'Últimas 24 horas' : 
                       currentPeriod === '7d' ? 'Últimos 7 días' : 'Mes actual';
    
    filterInfo.innerHTML = `
      <span class="material-symbols-outlined" style="color: #0284c7;">filter_alt</span>
      <span style="color: #0c4a6e; font-weight: 500;">
        Mostrando: <strong>${currentDeviceType}</strong> | Período: <strong>${periodText}</strong>
      </span>
    `;
  }

  // Agregar información de filtro
  addFilterInfo();

  // Actualizar información cuando cambien los filtros
  const originalUpdate = updateDashboard;
  updateDashboard = function() {
    originalUpdate();
    addFilterInfo();
  };

  // ============================================
  // SECCIÓN DE ALERTAS
  // ============================================
  function initializeAlertsSection() {
    const alertsSection = document.getElementById('alerts-section');
    const alertsContainer = document.getElementById('alerts-container');
    const alertsCard = statsGrid.querySelectorAll('div')[2];
    
    if (!alertsSection || !alertsContainer) return;
    
    // Hacer la tarjeta de alertas clickeable
    if (alertsCard) {
      alertsCard.style.cursor = 'pointer';
      alertsCard.addEventListener('click', function() {
        alertsSection.style.display = alertsSection.style.display === 'none' ? 'block' : 'none';
        if (alertsSection.style.display === 'block') {
          loadAlerts();
        }
      });
    }
  }

  function loadAlerts() {
    const alertsContainer = document.getElementById('alerts-container');
    if (!alertsContainer) return;
    
    const alerts = window.dashboardData.alerts;
    
    alertsContainer.innerHTML = '';
    
    alerts.forEach(alert => {
      const alertDiv = document.createElement('div');
      alertDiv.className = 'flex items-start gap-3 p-3 rounded-lg border';
      
      let bgColor = '';
      let iconColor = '';
      let icon = '';
      
      if (alert.severity === 'high') {
        bgColor = 'bg-red-50 border-red-200';
        iconColor = 'text-red-600';
        icon = 'error';
      } else if (alert.severity === 'medium') {
        bgColor = 'bg-yellow-50 border-yellow-200';
        iconColor = 'text-yellow-600';
        icon = 'warning';
      } else {
        bgColor = 'bg-blue-50 border-blue-200';
        iconColor = 'text-blue-600';
        icon = 'info';
      }
      
      alertDiv.className += ' ' + bgColor;
      
      alertDiv.innerHTML = `
        <span class="material-symbols-outlined ${iconColor}">${icon}</span>
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-semibold text-sm text-gray-900">${alert.device} - ${alert.type}</p>
              <p class="text-sm text-gray-600 mt-1">${alert.message}</p>
            </div>
            <span class="text-xs text-gray-500 whitespace-nowrap ml-2">Hace ${alert.time}</span>
          </div>
        </div>
      `;
      
      alertsContainer.appendChild(alertDiv);
    });
  }
});

