// TODO: after deploying chat-backend to Render, replace with the Render URL,
// e.g. 'https://chat-backend-xxxx.onrender.com/api/chat'
const CHAT_API_URL = 'http://localhost:3001/api/chat';

const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatSend = chatForm.querySelector('.chat-send');

let history = [];
let hasGreeted = false;

function openChat() {
  chatPanel.hidden = false;
  chatToggle.setAttribute('aria-expanded', 'true');
  chatInput.focus();
  if (!hasGreeted) {
    hasGreeted = true;
    addMessage(
      "Hi! I'm Annie's portfolio assistant. Ask me about her experience, skills, or certifications.",
      'bot'
    );
  }
}

function closeChat() {
  chatPanel.hidden = true;
  chatToggle.setAttribute('aria-expanded', 'false');
}

chatToggle.addEventListener('click', () => {
  chatPanel.hidden ? openChat() : closeChat();
});
chatClose.addEventListener('click', closeChat);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !chatPanel.hidden) closeChat();
});

function addMessage(text, role) {
  const bubble = document.createElement('div');
  bubble.className = `chat-msg ${role === 'user' ? 'user' : 'bot'}`;
  bubble.textContent = text; // textContent only — never render model output as HTML
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'chat-msg bot typing';
  el.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return el;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  chatInput.value = '';
  chatInput.disabled = true;
  chatSend.disabled = true;

  const typingEl = showTyping();

  try {
    const res = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });

    const data = await res.json();
    typingEl.remove();

    if (!res.ok) {
      addMessage(data.error || "Sorry, something went wrong. Please try again.", 'bot error');
    } else {
      addMessage(data.reply, 'bot');
      history.push({ role: 'user', text: message });
      history.push({ role: 'model', text: data.reply });
      history = history.slice(-10);
    }
  } catch (err) {
    typingEl.remove();
    addMessage(
      "I couldn't reach the assistant. Make sure the chat backend is running, or try again later.",
      'bot error'
    );
  } finally {
    chatInput.disabled = false;
    chatSend.disabled = false;
    chatInput.focus();
  }
});
