// Upgraded JS with animations & clean flow

// Change this if your backend runs on a different host/port
const BACKEND_URL = 'http://127.0.0.1:5000';
const LS_USER = 'sb_user', LS_CHATS = 'sb_chats';
let chats = [], activeChat = null;

function $(id) { return document.getElementById(id) }

const signInPage = $('signInPage');
const chatPage = $('chatPage');
const signinForm = $('signinForm');
const chatContainer = $('chatContainer');
const chatInput = $('chatInput');
const chatForm = $('chatForm')
const sidebar = $('sidebar');

function init() {
  loadChats();
  const user = JSON.parse(localStorage.getItem(LS_USER) || '{}');
  if (user.name) showChat(user.name);
}

signinForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = $('studentName').value.trim();
  const email = $('studentEmail').value.trim();
  localStorage.setItem(LS_USER, JSON.stringify({ name, email }));
  showChat(name);
});

function showChat(name) {
  signInPage.classList.add('hidden');
  chatPage.classList.remove('hidden');
  $('userGreeting').textContent = 'Hi, ' + name;
  createChat();
}

function createChat() {
  activeChat = { id: Date.now(), messages: [] };
  chats.push(activeChat);
  saveChats();
  renderChat();
}

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  let txt = chatInput.value.trim();
  if (!txt) return;
  pushMsg('user', txt);
  chatInput.value = '';
  botReply(txt);
});

function pushMsg(role, text) {
  activeChat.messages.push({ role, text });
  renderChat();
  saveChats();
}

function renderChat() {
  chatContainer.innerHTML = '';
  activeChat.messages.forEach(m => {
    let div = document.createElement('div');
    div.className = 'msg ' + m.role;
    div.textContent = m.text;
    chatContainer.appendChild(div);
  });
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function botReply(userText) {
  // Call backend /chat endpoint to get a reply
  pushMsg('bot', 'Thinking...');
  (async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const data = await res.json();
      activeChat.messages.pop();
      pushMsg('bot', data.reply || data.message || JSON.stringify(data));
    } catch (err) {
      console.error('chat error', err);
      activeChat.messages.pop();
      pushMsg('bot', 'Error contacting server: ' + (err.message || err));
    }
  })();
}

// Demo: call /api/say_hello and show response in #output
async function sendToPython(name = 'Neelanjan') {
  const out = $('output');
  if (out) out.textContent = 'Sending...';
  try {
    const res = await fetch(`${BACKEND_URL}/api/say_hello`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error(`Server ${res.status}`);
    const data = await res.json();
    if (out) out.textContent = data.message ?? JSON.stringify(data);
  } catch (err) {
    console.error('sendToPython error', err);
    if (out) out.textContent = 'Error: ' + (err.message || err);
  }
}

// Wire demo button and initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const btn = $('helloBtn');
  if (btn) btn.addEventListener('click', () => sendToPython());
  init();
});

function saveChats() { localStorage.setItem(LS_CHATS, JSON.stringify(chats)) }
function loadChats() { chats = JSON.parse(localStorage.getItem(LS_CHATS) || '[]') }

// Sidebar
$('openSidebar').onclick = () => sidebar.classList.add('open');
$('closeSidebar').onclick = () => sidebar.classList.remove('open');
