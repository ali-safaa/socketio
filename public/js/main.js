let chatForm = document.querySelector('#chat-form');
let chatMessages = document.querySelector('.chat-messages');
let roomName = document.querySelector('.room-name');
let userName = document.querySelector('#users');
let input = document.querySelector('#msg');

// get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

let socket = io();

// emit Join chatroom to server
socket.emit('joinRoom', { username, room });

// get room and users from  server
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});
// message from server
socket.on('message', (message) => {
  outputMessage(message);

  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// submit when we type a message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get message text
  input.value;
  // emit message to server
  socket.emit('chatMessage', input.value);
  // make input value empty
  input.value = '';
});

// output message to DOM
function outputMessage(message) {
  let div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// get users name from array users
function outputUsers(users) {
  userName.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join('')}`;
}
