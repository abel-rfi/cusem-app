// get query
const queryString = location.search;
const query = new URLSearchParams(queryString);
const id = query.get('id');
const ticket = query.get('ticket');

if (localStorage.getItem('agentId') === null & id !== null) {
	localStorage.setItem('agentId', id);
}

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
	xhr.open("POST", `/agent-dashboard/live-chat/accept-forward?id=${id}`);
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
