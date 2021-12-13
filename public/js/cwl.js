const chatForm = document.querySelector('.cust-live-chat-input-section');
const categoryForm = document.getElementById('cust-live-chat-category-section');
const chatSection = document.querySelector('.cust-live-chat-chat-section');
const ratingForm = document.querySelector('.rating-form');

var i;
var starVal = 1;

// get query
const queryString = location.search;
const query = new URLSearchParams(queryString);
const token = query.get('token');
localStorage.setItem('token', token);

let ticketSession = localStorage.getItem('ticketSession');
let category;

function logOut() {
	localStorage.clear();
	location.replace('/customer-website');
}

const socket = io();

if (ticketSession) {
	// console.log('test')
	socket.emit('joinTicket', {id: token, ticket: ticketSession, role: 'user'});
	// console.log('socket-id:', socket.id);
}

// Listen msg from server
socket.on('user-message', message => {
	// console.log(message);
	outputMessage(message);

	// scroll down
	chatSection.scrollTop = chatSection.scrollHeight;
});

// Listen msg from server
socket.on('agent-message', message => {
	outputMessageA(message);

	// scroll down
	chatSection.scrollTop = chatSection.scrollHeight;
});

// Listen msg from server
socket.on('ticket-session', ticketSession => {
	localStorage.setItem('ticketSession', ticketSession);
});

// Listen msg from server
socket.on('agent-accept', ({name}) => {
	changeAgentName(name);
});

socket.on('close-session', currenTicket => {
	// console.log('close session', currenTicket);
	location.href = '#live-chat-rating'
});

// Listen msg from server (Experimental)
// socket.on('message', id => {
// 	localStorage.setItem('currentUserId', id);
// });

// Listen msg from server
socket.on('session-expired', msg => {
	console.log(msg);
	localStorage.removeItem('ticketSession');
	// localStorage.removeItem('currentUserId');
	location.replace(' ');
})

// Get msg from input & send it to the server
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();
	ticketSession = localStorage.getItem('ticketSession');
	const msg = e.target.elements.msg.value;

	socket.emit('user-message', {ticketSession, msg});
	// console.log(msg, ticketSession);

	// clear msg
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

// rating listener
ratingForm.addEventListener('submit', e => {
	e.preventDefault();
	// console.log(e.target.elements);
	for ( i = 0; i < 5; i++ ) {
		if (e.target.elements[i].value * e.target.elements[i].checked > starVal) {
			starVal = e.target.elements[i].value;
		}
		if (e.target.elements[i].value == 1) {
			e.target.elements[i].checked = true;
		}
	}

	const body = JSON.stringify({
		ticketSession,
		rating: starVal,
		comment: e.target.elements[5].value
	});
	e.target.elements[5].value = ""
	
	localStorage.removeItem('ticketSession');
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/customer-website/logged/store-rating");
	xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);
	location.href = '#';
});

categoryForm.addEventListener('submit', e => {
	e.preventDefault();

	if (e.target.elements[0].value != '-'){
		category = e.target.elements[0].value;
		location.href = '#cust-live-chat-log';
		createTicket();
	}
})

function checkTicket() {
	ticketSession = localStorage.getItem('ticketSession');
	if (ticketSession === null) {
		location.href = '#cust-live-chat-category-section';
	} else {
		location.href = '#cust-live-chat-log';
	}
}

function createTicket() {
	ticketSession = localStorage.getItem('ticketSession');
	if (ticketSession == null){
		socket.emit('createTicket', {id: token, category});
	} else {
		socket.emit('joinTicket', {id: token, ticket: ticketSession, role: 'user'});
	}
}

function outputMessage(message) {
	const div = document.createElement('div');
	div.classList.add('cust-live-chat-chat');
	div.innerHTML = `${message}`;

	document.querySelector('.cust-live-chat-chat-section').appendChild(div);
}

function outputMessageA(message) {
	const div = document.createElement('div');
	div.classList.add('cust-live-chat-chat');
	div.classList.add('agent-chat');
	div.innerHTML = `${message}`;

	document.querySelector('.cust-live-chat-chat-section').appendChild(div);
}

function changeAgentName(name) {
	document.getElementById('live-chat-agent-name').innerHTML = name;
}

function finishTicketSession() {
	localStorage.removeItem('ticketSession');
	// localStorage.removeItem('currentUserId')
	// harus buat tiket statusnya jika blm closed jdi cancelled.
}
