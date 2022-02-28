const liveChatSection = document.getElementById('alc');
const chatMonitor = document.querySelector('.live-chat-monitor');
const statusToggler = document.querySelector('.status-toggler');

// Global Variable
const roomElement = document.getElementById("roomName");
const client = 'agent';
let room;

// Socket Section

const socket = io();

if (roomElement != null) {
    room = roomElement.value;
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
}

// Event Listener Section

liveChatSection.addEventListener('submit', e => {
	e.preventDefault();
	this.sendMessage();
});

// Function Section

function getOpenTicket() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        const openList = document.getElementById("open-list");
        const checkButton = document.querySelector(".accept-button");
        openList.innerHTML = '';
        let tickets = JSON.parse(this.responseText);
        for (var i = 0; i < tickets.length; i++) {
            const li = document.createElement('li');
            li.classList.add("list-group-item");
            const row = document.createElement('div');
            row.classList.add("row");
            const col9 = document.createElement('div');
            col9.classList.add("col-9");
            col9.classList.add("d-flex");
            col9.classList.add("align-items-center");
            col9.innerHTML = tickets[i]["user.name"];
            const col2 = document.createElement('div');
            col2.classList.add("col-2");
            const check = checkButton.cloneNode(true);
            check.classList.add("take-ticket");
            check.id = tickets[i].id;
            // console.log(check);
            col2.appendChild(check);
            row.appendChild(col9);
            row.appendChild(col2);
            li.appendChild(row);
            openList.appendChild(li);
        }
        ticketListener();
    }
    xhttp.open("POST", `/agent-dashboard/live-chat/get-open`);
    xhttp.send();
}

function ticketListener() {
    const checks = document.querySelectorAll(".take-ticket");
    for (var i = 0; i < checks.length; i++) {
        checks[i].addEventListener('click', e => {
            e.preventDefault();

            if (e.target.id != '') {
                var id = e.target.id;
                // console.log(id);
                this.takeTicket(id);
            }
        });
    }
}

function takeTicket(id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        let result = JSON.parse(this.responseText);
        if (result.success){
            document.location = `live-chat/${id}`;
        }
    }

    xhr.open("POST", `/agent-dashboard/live-chat/take-ticket?id=${id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();    
}

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