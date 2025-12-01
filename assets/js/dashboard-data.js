// ============================================
// DATOS DE EJEMPLO PARA EL DASHBOARD
// ============================================

// Datos de dispositivos
const devicesData = [
  { id: 'SEN-TEMP-01A', type: 'Sensor Temperatura', location: 'Sala Principal', reading: '20.5°C', consumption: 150.2, status: 'online', lastUpdate: '2 min' },
  { id: 'PWR-MTR-05B', type: 'Medidor Energía', location: 'Edificio A', reading: '5.8 kW', consumption: 128.9, status: 'online', lastUpdate: '1 min' },
  { id: 'CAM-SEC-02C', type: 'Cámara', location: 'Entrada Principal', reading: 'Activa', consumption: 95.4, status: 'online', lastUpdate: '30 seg' },
  { id: 'SEN-HUM-03D', type: 'Sensor Humedad', location: 'Almacén', reading: '45%', consumption: 72.1, status: 'online', lastUpdate: '3 min' },
  { id: 'PWR-MTR-08A', type: 'Medidor Energía', location: 'Edificio B', reading: '4.2 kW', consumption: 68.5, status: 'online', lastUpdate: '1 min' },
  { id: 'SEN-TEMP-09F', type: 'Sensor Temperatura', location: 'Oficina 201', reading: '22.1°C', consumption: 58.3, status: 'online', lastUpdate: '5 min' },
  { id: 'CAM-SEC-11G', type: 'Cámara', location: 'Estacionamiento', reading: 'Activa', consumption: 52.7, status: 'warning', lastUpdate: '2 min' },
  { id: 'SEN-TEMP-14H', type: 'Sensor Temperatura', location: 'Laboratorio', reading: '18.9°C', consumption: 48.9, status: 'online', lastUpdate: '4 min' },
  { id: 'PWR-MTR-17J', type: 'Medidor Energía', location: 'Edificio C', reading: '3.5 kW', consumption: 45.2, status: 'online', lastUpdate: '2 min' },
  { id: 'SEN-HUM-19K', type: 'Sensor Humedad', location: 'Sala de Servidores', reading: '38%', consumption: 41.8, status: 'online', lastUpdate: '6 min' },
  { id: 'CAM-SEC-21L', type: 'Cámara', location: 'Recepción', reading: 'Activa', consumption: 38.5, status: 'online', lastUpdate: '1 min' },
  { id: 'SEN-TEMP-23M', type: 'Sensor Temperatura', location: 'Cafetería', reading: '21.3°C', consumption: 35.1, status: 'online', lastUpdate: '3 min' },
  { id: 'PWR-MTR-25N', type: 'Medidor Energía', location: 'Planta Baja', reading: '2.8 kW', consumption: 32.4, status: 'offline', lastUpdate: '15 min' },
  { id: 'SEN-HUM-27P', type: 'Sensor Humedad', location: 'Bodega 2', reading: '52%', consumption: 28.9, status: 'online', lastUpdate: '7 min' },
  { id: 'CAM-SEC-29Q', type: 'Cámara', location: 'Pasillo Norte', reading: 'Activa', consumption: 25.6, status: 'online', lastUpdate: '2 min' },
];

// Datos históricos por período
const historicalData = {
  '24h': {
    totalConsumption: 1204,
    currentConsumption: 850,
    devicesOnline: 142,
    devicesTotal: 150,
    alerts: 3,
    trend: '+2.5%',
    chartData: [
      { time: '00:00', value: 45 },
      { time: '02:00', value: 38 },
      { time: '04:00', value: 35 },
      { time: '06:00', value: 52 },
      { time: '08:00', value: 78 },
      { time: '10:00', value: 95 },
      { time: '12:00', value: 105 },
      { time: '14:00', value: 98 },
      { time: '16:00', value: 88 },
      { time: '18:00', value: 92 },
      { time: '20:00', value: 85 },
      { time: '22:00', value: 68 },
      { time: '23:59', value: 55 }
    ]
  },
  '7d': {
    totalConsumption: 8428,
    currentConsumption: 1204,
    devicesOnline: 142,
    devicesTotal: 150,
    alerts: 12,
    trend: '+5.8%',
    chartData: [
      { time: 'Lun', value: 1150 },
      { time: 'Mar', value: 1220 },
      { time: 'Mié', value: 1180 },
      { time: 'Jue', value: 1265 },
      { time: 'Vie', value: 1310 },
      { time: 'Sáb', value: 1099 },
      { time: 'Dom', value: 1204 }
    ]
  },
  '30d': {
    totalConsumption: 36150,
    currentConsumption: 1204,
    devicesOnline: 142,
    devicesTotal: 150,
    alerts: 45,
    trend: '+8.2%',
    chartData: [
      { time: 'Sem 1', value: 8250 },
      { time: 'Sem 2', value: 8890 },
      { time: 'Sem 3', value: 9320 },
      { time: 'Sem 4', value: 9690 }
    ]
  }
};

// Distribución por tipo de dispositivo
const distributionData = {
  'all': [
    { type: 'Medidores', percentage: 45, color: '#3b82f6' },
    { type: 'Sensores', percentage: 30, color: '#22d3ee' },
    { type: 'Cámaras', percentage: 15, color: '#a855f7' },
    { type: 'Otros', percentage: 10, color: '#9ca3af' }
  ],
  'Sensor Temperatura': [
    { type: 'Sensor Temperatura', percentage: 100, color: '#3b82f6' }
  ],
  'Medidor Energía': [
    { type: 'Medidor Energía', percentage: 100, color: '#22d3ee' }
  ],
  'Cámara': [
    { type: 'Cámara', percentage: 100, color: '#a855f7' }
  ]
};

// Alertas recientes
const alertsData = [
  { id: 1, device: 'PWR-MTR-25N', type: 'Offline', message: 'Dispositivo sin conexión', time: '15 min', severity: 'high' },
  { id: 2, device: 'CAM-SEC-11G', type: 'Warning', message: 'Consumo elevado detectado', time: '2 horas', severity: 'medium' },
  { id: 3, device: 'SEN-TEMP-01A', type: 'Info', message: 'Temperatura fuera de rango', time: '3 horas', severity: 'low' }
];

// Función para filtrar dispositivos por tipo
function filterDevicesByType(type) {
  if (type === 'Todos los Dispositivos') {
    return devicesData;
  }
  return devicesData.filter(device => device.type === type);
}

// Función para obtener top N dispositivos
function getTopDevices(n = 5, type = 'all') {
  let devices = type === 'all' ? devicesData : filterDevicesByType(type);
  return devices
    .sort((a, b) => b.consumption - a.consumption)
    .slice(0, n);
}

// Función para calcular estadísticas por tipo
function getStatsByType(type) {
  const devices = type === 'Todos los Dispositivos' ? devicesData : filterDevicesByType(type);
  const totalConsumption = devices.reduce((sum, device) => sum + device.consumption, 0);
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  
  return {
    totalDevices: devices.length,
    onlineDevices: onlineDevices,
    totalConsumption: totalConsumption.toFixed(1),
    avgConsumption: (totalConsumption / devices.length).toFixed(1)
  };
}

// Exportar datos
if (typeof window !== 'undefined') {
  window.dashboardData = {
    devices: devicesData,
    historical: historicalData,
    distribution: distributionData,
    alerts: alertsData,
    filterDevicesByType,
    getTopDevices,
    getStatsByType
  };
}

