let peer = new Peer();
let conn;

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
    appendMsg("You connected!", 'system');
  });

  conn.on('data', (data) => {
    appendMsg(data, 'them');
  });

  conn.on('close', () => {
    appendMsg("Connection closed 😢", 'system');
  });
}

function sendMsg() {
  const input = document.getElementById('msg');
  const text = input.value;
  if (conn && conn.open) {
    conn.send(text);
    appendMsg(text, 'you');
    input.value = "";
  }
}

function appendMsg(msg, who) {
  const chat = document.getElementById('chat');
  const el = document.createElement('div');
  el.className = `msg ${who}`;
  el.textContent = who === 'you' ? "You: " + msg : who === 'them' ? "Them: " + msg : msg;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}
