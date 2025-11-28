// ============================================
// CONFIGURACIÓN DEL CHAT
// ============================================
// 
// INSTRUCCIONES:
// 1. Reemplaza 'TU_TOKEN_DE_GITHUB_AQUI' con tu token real de GitHub
// 2. Obtén tu token en: https://github.com/marketplace/models
// 3. Guarda este archivo después de hacer los cambios
//
// ============================================

const CHAT_CONFIG = {
  // 🔑 Coloca tu token de GitHub aquí
  token: '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',
  
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

