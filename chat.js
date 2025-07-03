let peer = new Peer();
let conn;
let typingTimeout;

peer.on('open', (id) => {
  document.getElementById('my-id').textContent = id;
});

peer.on('connection', (c) => {
  conn = c;
  setupConnection();
});

function connect() {
  const id = document.getElementById('connect-id').value;
  conn = peer.connect(id);
  setupConnection();
}

function setupConnection() {
  conn.on('open', () => {
    appendMsg("Connected 💖", 'system');
  });

  conn.on('data', (data) => {
    if (data.type === 'msg') {
      playWhisper();
      appendMsg(data.text, 'them');
    } else if (data.type === 'typing') {
      showTyping("Typing...");
    }
  });

  conn.on('close', () => {
    appendMsg("Connection closed 😢", 'system');
  });
}

function sendMsg() {
  const input = document.getElementById('msg');
  const text = input.value.trim();
  if (conn && conn.open && text !== '') {
    conn.send({ type: 'msg', text });
    appendMsg(text, 'you');
    input.value = "";
    hideTyping();
  }
}

function appendMsg(msg, who) {
  const chat = document.getElementById('chat');
  const el = document.createElement('div');
  el.className = `msg ${who}`;
  el.textContent = (who === 'you' ? "You: " : who === 'them' ? "Them: " : "") + msg;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

function playWhisper() {
  const sound = document.getElementById('whisper');
  if (sound) sound.play().catch(() => {});
}

function sendTyping() {
  if (conn && conn.open) {
    conn.send({ type: 'typing' });
  }
}

function showTyping(text) {
  const typing = document.getElementById('typing');
  typing.textContent = text;
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(hideTyping, 2000);
}

function hideTyping() {
  const typing = document.getElementById('typing');
  typing.textContent = "";
              }
