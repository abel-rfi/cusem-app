const liveChatSection = document.getElementById('alc');
const chatMonitor = document.querySelector('.live-chat-monitor');
const statusToggler = document.querySelector('.status-toggler');

// Global Variable
const room = document.getElementById("roomName").value;
const client = 'agent';

// Socket Section

const socket = io();

socket.emit('join-ticket', {roomId: room, user: client});

socket.on('user-message', msg => {
    this.outputMessage(msg);
});

socket.on('agent-message', msg => {
    this.outputMessageAgent(msg);
});

socket.on('server-message', msg => {
    this.outputMessageServer(msg);
});

// Event Listener Section

liveChatSection.addEventListener('submit', e => {
	e.preventDefault();
	this.sendMessage();
});

// Function Section

function outputMessageAgent(msg) {
	console.log(`'${msg}' <= Me`);

	const div = document.createElement('div');
    div.classList.add("chat");
    div.classList.add("left");
    div.classList.add("bg-primary");
    div.innerHTML = `${msg}`;

    chatMonitor.appendChild(div);
}

function outputMessage(msg) {
	console.log(`'${msg}' <= Me`);

	const div = document.createElement('div');
    div.classList.add("chat");
    div.classList.add("right");
    div.classList.add("chat-client");
    div.classList.add("bg-light");
    div.classList.add("text-dark");
    div.innerHTML = `${msg}`;

    chatMonitor.appendChild(div);
}

function outputMessageServer(msg) {
	console.log(`'${msg}' <= Server`);

	const div = document.createElement('div');
    div.classList.add("chat");
    div.classList.add("server-chat");
    div.classList.add("bg-dark");
    div.classList.add("text-light");
    div.innerHTML = `${msg}`;

    chatMonitor.appendChild(div);
}

function sendMessage() {
	const lcInput = document.querySelector('.lc-input');
	var msg = lcInput.value;

	console.log(`Agent => '${msg}'`);
	socket.emit('agent-message', {roomId: room, msg});

    // Create LC Ticket
    const body = JSON.stringify({
        room,
        msg
    });
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/agent-dashboard/live-chat/send");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);
	
	lcInput.value = '';
	lcInput.focus();
}

function toggleStatus() {
    console.log(statusToggler.innerHTML);
}