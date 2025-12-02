# ⚡ Voltaje Simulado - Sensor Dañado

## 🔧 Situación

El sensor de voltaje del ACS712 está **dañado o no funcional**, por lo que el dashboard ahora utiliza un **voltaje simulado** basado en el voltaje doméstico estándar de tu país.

## 🌍 Voltajes Domésticos por Región

### 120V (Norteamérica y Japón)
- 🇲🇽 México
- 🇺🇸 Estados Unidos
- 🇨🇦 Canadá
- 🇯🇵 Japón
- 🇨🇷 Costa Rica
- 🇵🇦 Panamá

### 220V (Europa, Asia, Sudamérica)
- 🇪🇸 España
- 🇦🇷 Argentina
- 🇨🇱 Chile
- 🇨🇴 Colombia
- 🇵🇪 Perú
- 🇧🇷 Brasil (127V/220V)
- 🇨🇳 China
- Y la mayoría de países

## ⚙️ Cómo Funciona

### 1. **Corriente Real** (del sensor ACS712)
El sensor de corriente **SÍ funciona** y proporciona valores reales medidos del flujo eléctrico.

### 2. **Voltaje Simulado** (configurado manualmente)
El voltaje se establece a **120V por defecto** (para México/USA). Este valor:
- ✅ **Se guarda en el navegador** (localStorage)
- ✅ **Puedes cambiarlo** cuando quieras
- ✅ **Es constante** (no varía como un sensor real)

### 3. **Potencia Calculada**
```
Potencia (W) = Corriente Real (A) × Voltaje Simulado (V)
```

**Ejemplo:**
- Corriente medida: `0.15 A` (real del sensor)
- Voltaje simulado: `120 V` (configurado)
- Potencia calculada: `18 W` (0.15 × 120)

## 🔄 Cambiar el Voltaje Simulado

### Opción 1: Desde la Interfaz
1. Abre `index.html`
2. Busca la sección **"Configuración de Conexión"**
3. Verás una nota amarilla que dice **"Voltaje Simulado"**
4. Haz clic en **"configurar"**
5. Ingresa el nuevo voltaje (ejemplo: `220`)
6. El cambio se aplica inmediatamente

### Opción 2: Desde el Código
Edita `/assets/js/esp32-api.js` línea 8:

```javascript
simulatedVoltage: 120  // Cambia a 220 para Europa/Sudamérica
```

## 📊 Datos Afectados

### ✅ Datos REALES (del sensor físico):
- Corriente (A)
- ADC del sensor
- Detección de flama
- Estado del sistema

### ⚠️ Datos CALCULADOS (usan voltaje simulado):
- Voltaje (V) - **Mostrado con indicador "⚠️ Simulado"**
- Potencia (W) - Corriente real × Voltaje simulado
- Consumo diario (kWh) - Basado en potencia calculada
- Consumo mensual (kWh) - Basado en potencia calculada
- Costo estimado ($) - Basado en consumo calculado

## 🎨 Indicadores Visuales

### En el Dashboard:
- **⚠️ Simulado** - Aparece debajo del valor de voltaje
- **Nota amarilla** - En la configuración explica la situación
- **Color naranja** - El indicador es color ámbar/naranja

### Ejemplo Visual:
```
┌─────────────────────┐
│ Voltaje (V)         │
│ 120.0 V             │
│ En tiempo real      │
│ ⚠️ Simulado         │ ← Indicador visible
└─────────────────────┘
```

## 🧮 Precisión de los Cálculos

### ✅ Muy Precisa:
Si tu voltaje doméstico es **estable** (como en la mayoría de países desarrollados):
- La corriente es real y medida
- El voltaje es constante y conocido
- Los cálculos de potencia son **muy precisos**

### ⚠️ Menos Precisa:
Si tu voltaje doméstico **varía mucho**:
- Las lecturas pueden diferir del consumo real
- Considera ajustar el voltaje según tu medidor eléctrico

## 🔍 Verificar si tu Voltaje es Correcto

### Método 1: Medidor Eléctrico
Compara el consumo calculado por el dashboard con tu medidor de luz real.

### Método 2: Multímetro
Mide el voltaje de tu toma de corriente con un multímetro y ajusta el valor simulado.

### Método 3: Dispositivo de Referencia
1. Conecta un dispositivo con consumo conocido (bombilla de 60W)
2. Verifica que la potencia calculada sea cercana a 60W
3. Ajusta el voltaje simulado si es necesario

## 🛠️ Reparación del Sensor (Futuro)

Si en el futuro reparas o reemplazas el sensor de voltaje:

1. **Edita** `/assets/js/esp32-api.js`
2. **Comenta** estas líneas:

```javascript
// Comentar estas líneas cuando el sensor funcione:
// const voltajeSimulado = esp32Config.simulatedVoltage;
// voltaje: voltajeSimulado,
// voltajeEsSimulado: true

// Descomentar esta línea:
voltaje: data.acs712.voltaje, // Usar voltaje real del sensor
```

3. **Elimina** o **oculta** el indicador "⚠️ Simulado" en `index.html`

## 📝 Notas Técnicas

### Almacenamiento:
- El voltaje simulado se guarda en `localStorage` del navegador
- Clave: `esp32_simulated_voltage`
- Tipo: `float`
- Por defecto: `120`

### API:
```javascript
// Configurar voltaje
window.ESP32API.setSimulatedVoltage(220);

// Obtener voltaje actual
const voltage = window.ESP32API.getSimulatedVoltage();
```

### Compatibilidad:
- ✅ Todos los navegadores modernos
- ✅ Persistencia entre sesiones
- ✅ No afecta el código de la ESP32

## ❓ Preguntas Frecuentes

**P: ¿Por qué no usar el voltaje que envía la ESP32?**  
R: El sensor de voltaje está dañado, por lo que envía valores incorrectos (0, valores aleatorios, etc.).

**P: ¿Es menos preciso este método?**  
R: Para cálculos de consumo doméstico, es **muy preciso** si el voltaje doméstico es estable.

**P: ¿Puedo cambiar el voltaje mientras está monitoreando?**  
R: ¡Sí! Los cambios se aplican inmediatamente sin necesidad de reiniciar.

**P: ¿Qué pasa si pongo un voltaje incorrecto?**  
R: Los cálculos de potencia y consumo serán incorrectos. Ajústalo según tu país.

**P: ¿Se puede eliminar el indicador "Simulado"?**  
R: Sí, pero se recomienda dejarlo para recordar que el voltaje no es medido.

## 🎯 Resumen

| Concepto | Estado |
|----------|--------|
| Sensor de Corriente | ✅ Funcional (valores reales) |
| Sensor de Voltaje | ❌ Dañado (se simula) |
| Sensor de Flama | ✅ Funcional (valores reales) |
| Cálculo de Potencia | ⚠️ Basado en voltaje simulado |
| Precisión General | ✅ Alta (si voltaje es correcto) |

---

**Última actualización**: Diciembre 2025  
**Voltaje por defecto**: 120V (México/USA)

