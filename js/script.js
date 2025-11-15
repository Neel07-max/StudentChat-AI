// Upgraded JS with animations & clean flow

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
  pushMsg('bot', 'Thinking...');
  setTimeout(() => {
    activeChat.messages.pop();
    pushMsg('bot', 'Here is your answer: ' + userText);
  }, 900);
}

function saveChats() { localStorage.setItem(LS_CHATS, JSON.stringify(chats)) }
function loadChats() { chats = JSON.parse(localStorage.getItem(LS_CHATS) || '[]') }

// Sidebar
$('openSidebar').onclick = () => sidebar.classList.add('open');
$('closeSidebar').onclick = () => sidebar.classList.remove('open');
