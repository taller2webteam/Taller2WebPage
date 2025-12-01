// ============================================
// CONFIGURACIÓN DEL CHAT
// ============================================

const CHAT_CONFIG = {
  // 🤖 Modelo a usar (opciones: 'gpt-4o', 'gpt-4o-mini', 'gpt-4')
  model: 'gpt-4o',
  
  // 🌡️ Temperatura (0.0 = más preciso, 1.0 = más creativo)
  temperature: 0.7,
  
  // 📝 Máximo de tokens por respuesta
  maxTokens: 1000,
  
  // 💬 Mensaje de bienvenida
  welcomeMessage: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
  
  // 🎭 Personalidad del asistente
  systemPrompt: 'Eres un asistente virtual útil y amigable. Respondes en español de manera clara y concisa. Puedes ayudar con información general, responder preguntas y mantener conversaciones naturales.'
};

// ⚠️ NO MODIFIQUES EL CÓDIGO DEBAJO DE ESTA LÍNEA
// ============================================

// Exportar configuración para uso en chat.js
if (typeof window !== 'undefined') {
  window.CHAT_CONFIG = CHAT_CONFIG;
}

