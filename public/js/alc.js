const chatForm = document.getElementById('chat-form');
const chatSection = document.querySelector('.chat-section');

const socket = io();

// get query
const queryString = location.search;
const query = new URLSearchParams(queryString);
const id = query.get('id');
const ticket = query.get('ticket');

// console.log(id, ticket)
if (id !== null & ticket !== null){
	socket.emit('joinTicket', {id, ticket, role:'agent'});
}

// Message from server
socket.on('user-message', message => {
	outputMessageU(message);

	// scroll down
	chatSection.scrollTop = chatSection.scrollHeight;
});

// Message from server
socket.on('agent-message', message => {
	outputMessage(message);

	// scroll down
	chatSection.scrollTop = chatSection.scrollHeight;
});

// Message from server
socket.on('message', id => {
	// localStorage.setItem('currentAgentId', id);
});

// socket.on('agent-accept', name => {
// 	localStorage.setItem('agent_name', name);
// });

// Message Submit
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// get message text
	const msg = e.target.elements.msg.value;

	// emit the message
	socket.emit('agent-message', {ticket, msg});

	// clear msg
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

// Output Message to DOM
function outputMessage (message){
	const div = document.createElement('div');
	div.classList.add('chat');
	div.innerHTML = `${message}`;

	document.querySelector('.chat-section').appendChild(div);
}

function outputMessageU (message) {
	const div = document.createElement('div');
	div.classList.add('chat');
	div.classList.add('chat-b');
	div.innerHTML = `${message}`;

	document.querySelector('.chat-section').appendChild(div);
}

function changeTicketStatus() {
	const currentStatus = document.querySelector('.current-status');
	if (currentStatus.innerHTML == "on Progress") {
		currentStatus.innerHTML = "on Hold";
	} else if (currentStatus.innerHTML == "on Hold") {
		currentStatus.innerHTML = "on Progress";
	}
	const body = JSON.stringify({
		emplId: id,
		roomName: ticket,
		complaintStatus: currentStatus.innerHTML
	});

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/agent-dashboard/live-chat/change-status");
	xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);
}

function closedTicketSession() {
	// console.log('tes', ticket, id);
	const body = JSON.stringify({
		emplId: id,
		roomName: ticket,
		complaintStatus: 'closed'
	});

	document.querySelector('.current-status').innerHTML = 'closed';

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/agent-dashboard/live-chat/change-status");
	xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);
    // location.replace('/agent-dashboard/live-chat');
}