const chatForm = document.getElementById('chat-form');
const chatSection = document.querySelector('.chat-section');

const socket = io();

// get query
const queryString = location.search;
const query = new URLSearchParams(queryString);
const id = query.get('id');
const ticket = query.get('ticket');

var accepted = document.getElementsByClassName("live-chat-customer-button");
var navbars = document.getElementsByClassName("live-chat-button");

for (var i = 0; i < navbars.length; i++) {
	// console.log(navbars[i].innerHTML);
	if (navbars[i].innerHTML === 'Live Chat' && location.pathname === '/agent-dashboard/live-chat'){
		navbars[i].classList.toggle('nav-button-active');
	}else if (navbars[i].innerHTML === 'Live Chat' && location.pathname === '/agent-dashboard/live-chat/customer-selector'){
		navbars[i].classList.toggle('nav-button-active');
	}else if (navbars[i].innerHTML === 'Live Chat' && location.pathname === '/agent-dashboard/live-chat/forward-selector'){
		navbars[i].classList.toggle('nav-button-active');
	}else if (navbars[i].innerHTML === 'Live Chat' && location.pathname === '/agent-dashboard/live-chat/forward-sender'){
		navbars[i].classList.toggle('nav-button-active');
	} else if (navbars[i].innerHTML === 'Dashboard' && location.pathname === '/agent-dashboard') {
		navbars[i].classList.toggle('nav-button-active');
	} else if (navbars[i].innerHTML === 'Ticket Archieve' && location.pathname === 'agent-dashboard/ticket-archieve') {
		navbars[i].classList.toggle('nav-button-active');
	}
}

// if (location.pathname === '/agent-dashboard/live-chat') {
// 	accepted[i].classList.toggle('nav-button-active');
// }

if (localStorage.getItem('agentId') === null & id !== null) {
	localStorage.setItem('agentId', id);
}

// console.log(id, ticket)
if (id !== null & ticket !== null){
	socket.emit('joinTicket', {id, ticket, role:'agent'});
	var i;
	for (i=0; i < accepted.length; i++) {
		var openedTicket = accepted[i].lastElementChild.value;
		if (openedTicket === ticket) {
			// live-chat-customer-selected
			accepted[i].classList.toggle('live-chat-customer-selected');
		}
	}
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

	socket.emit('close-session', ticket);

	document.querySelector('.current-status').innerHTML = 'closed';

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/agent-dashboard/live-chat/change-status");
	xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);
    // location.replace(`/agent-dashboard/live-chat?id=${id}`);
}

function sendForward() {
	var dropdown = document.getElementById("agent-dropdown");
	var options = document.getElementsByClassName("dropdown-option");
	var i;
	var targetId;
	if (dropdown.value != '-') {
		for (i = 0; i < options.length; i++) {
			if (options[i].value == dropdown.value) {
				targetId = options[i].attributes.targetId.nodeValue;
			}
		}
		const body = JSON.stringify({
			emplId: id,
			passedTo: targetId,
			roomName: ticket
		});
		// console.log(body);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/agent-dashboard/live-chat/forward-ticket");
		xhr.setRequestHeader("Content-Type", "application/json");
	 	xhr.send(body);
	 	// location.replace(`/agent-dashboard/live-chat?id=${id}`);
	}
}

function acceptForward() {
	const body = JSON.stringify({
		emplId: id,
		roomName: document.getElementById('forwardRoomName').value,
		passedFrom: document.getElementById('forwardEmpl').value
	});
	// console.log(body);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/agent-dashboard/live-chat/accept-forward");
	xhr.setRequestHeader("Content-Type", "application/json");
 	xhr.send(body);
 	// location.replace(`/agent-dashboard/live-chat?id=${id}`);
}

function logOut() {
	localStorage.removeItem('agentId');
	location.replace('/employee-login-page');
}

function EditProfile() {
	location.replace(`/agent-list-page/open-agent/${id}`)
}
