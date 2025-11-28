// ============================================
// CONFIGURACIÓN - CAMBIA TU TOKEN EN chat-config.js
// ============================================
const GITHUB_TOKEN = window.CHAT_CONFIG?.token || 'TU_TOKEN_DE_GITHUB_AQUI';
const GITHUB_MODEL = window.CHAT_CONFIG?.model || 'gpt-4o';
const TEMPERATURE = window.CHAT_CONFIG?.temperature || 0.7;
const MAX_TOKENS = window.CHAT_CONFIG?.maxTokens || 1000;
const SYSTEM_PROMPT = window.CHAT_CONFIG?.systemPrompt || 'Eres un asistente virtual útil y amigable. Respondes en español de manera clara y concisa. Puedes ayudar con información general, responder preguntas y mantener conversaciones naturales.';
// ============================================

const chatButton = document.getElementById('chatButton');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');

let conversationHistory = [];

// Initialize welcome message if configured
if (window.CHAT_CONFIG?.welcomeMessage) {
  const welcomeMsg = chatMessages.querySelector('.message-content');
  if (welcomeMsg) {
    welcomeMsg.textContent = window.CHAT_CONFIG.welcomeMessage;
  }
}

// Toggle chat window
chatButton.addEventListener('click', function() {
  chatWindow.classList.toggle('show');
  if (chatWindow.classList.contains('show')) {
    chatInput.focus();
  }
});

closeChat.addEventListener('click', function() {
  chatWindow.classList.remove('show');
});

// Send message on button click
sendMessage.addEventListener('click', sendUserMessage);

// Send message on Enter key
chatInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendUserMessage();
  }
});

async function sendUserMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  // Add user message to chat
  addMessage(message, 'user');
  chatInput.value = '';

  // Add to conversation history
  conversationHistory.push({
    role: 'user',
    content: message
  });

  // Show typing indicator
  const typingId = addTypingIndicator();

  try {
    // Call GitHub Models API
    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          ...conversationHistory
        ],
        model: GITHUB_MODEL,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS
      })
    });

    // Remove typing indicator
    removeTypingIndicator(typingId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error ${response.status}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Add assistant response to chat
    addMessage(assistantMessage, 'assistant');

    // Add to conversation history
    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    });

  } catch (error) {
    removeTypingIndicator(typingId);
    console.error('Error al comunicarse con la API:', error);
    
    let errorMessage = 'Lo siento, hubo un error al procesar tu mensaje.';
    if (error.message.includes('401') || error.message.includes('403')) {
      errorMessage = 'Error de autenticación. Por favor, verifica que el token de GitHub esté configurado correctamente.';
    } else if (error.message.includes('429')) {
      errorMessage = 'Se ha excedido el límite de solicitudes. Por favor, espera un momento e intenta de nuevo.';
    } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      errorMessage = 'El servicio no está disponible en este momento. Por favor, intenta más tarde.';
    }
    
    addMessage(errorMessage, 'error');
  }
}

function addMessage(text, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${type}-message`;

  if (type === 'user') {
    messageDiv.innerHTML = `
      <div class="message-content">${escapeHtml(text)}</div>
      <div class="message-avatar user-avatar">
        <span class="material-symbols-outlined">person</span>
      </div>
    `;
  } else if (type === 'error') {
    messageDiv.innerHTML = `
      <div class="message-avatar error-avatar">
        <span class="material-symbols-outlined">error</span>
      </div>
      <div class="message-content">${escapeHtml(text)}</div>
    `;
  } else {
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <span class="material-symbols-outlined">smart_toy</span>
      </div>
      <div class="message-content">${formatMessage(text)}</div>
    `;
  }

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message assistant-message typing-indicator';
  typingDiv.id = 'typing-' + Date.now();
  typingDiv.innerHTML = `
    <div class="message-avatar">
      <span class="material-symbols-outlined">smart_toy</span>
    </div>
    <div class="message-content">
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typingDiv.id;
}

function removeTypingIndicator(id) {
  const typingDiv = document.getElementById(id);
  if (typingDiv) {
    typingDiv.remove();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatMessage(text) {
  // Escape HTML first
  let formatted = escapeHtml(text);
  
  // Convert line breaks to <br>
  formatted = formatted.replace(/\n/g, '<br>');
  
  // Basic markdown-like formatting (optional)
  // Bold: **text** or __text__
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic: *text* or _text_
  formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/_(.+?)_/g, '<em>$1</em>');
  
  return formatted;
}

