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

function getForwardRequest() {
    const reqList = document.getElementById("forwardRequestList");
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        const accept = document.querySelector(".accept-req");
        const decline = document.querySelector(".refuse-req");
        reqList.innerHTML = '';
        const {success, forwardRequest} = JSON.parse(this.responseText);
        if (success) {
            // console.log(success, forwardRequest);
            for (var i = 0; i < forwardRequest.length; i++) {
                const row = document.createElement('div');
                row.classList.add("row");
                row.classList.add("mb-1");
                const col8 = document.createElement('div');
                col8.classList.add("col-8");
                col8.classList.add("d-flex");
                col8.classList.add("align-items-center");
                col8.innerHTML = `${forwardRequest[i]["user.name"]} from ${forwardRequest[i]["employeeRecv.name"]}`;
                const col4 = document.createElement('div');
                col4.classList.add("col-4");
                col4.classList.add("d-flex");
                col4.classList.add("justify-content-around");
                const acc = accept.cloneNode(true);
                acc.id = forwardRequest[i]['id'];
                const dec = decline.cloneNode(true);
                dec.id = forwardRequest[i]['id'];
                col4.appendChild(acc);
                col4.appendChild(dec);
                row.appendChild(col8);
                row.appendChild(col4);
                reqList.appendChild(row);
            }
            requestListener();
        }
    }
    xhr.open("POST", '/agent-dashboard/live-chat/get-forward-request');
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
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

function requestListener() {
    const accepts = document.querySelectorAll(".accept-req");
    const declines = document.querySelectorAll(".refuse-req");
    for (var i = 0; i < accepts.length; i++) {
        // console.log(accepts[i], declines[i]);
        accepts[i].addEventListener('click', e => {
            e.preventDefault();

            if (e.target.id != '') {
                requestDecision("Accept", e.target.id);
            }
        });
        declines[i].addEventListener('click', e => {
            e.preventDefault();

            if (e.target.id != '') {
                requestDecision("Decline", e.target.id);
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

function requestDecision(decision, id) {
    console.log(id, decision);
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        let result = JSON.parse(this.responseText);
        if (result.success){
            if (decision == "Accept") {
                document.location = `live-chat/${id}`;
            } else {
                document.location.reload();
            }
        }
    }

    xhr.open("POST", `/agent-dashboard/live-chat/forward-request-decision?id=${id}&&decision=${decision}`);
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
	// console.log(`'${msg}' <= Me`);

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
	// console.log(`'${msg}' <= Server`);

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

	// console.log(`Agent => '${msg}'`);
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
    const textStatus = document.getElementById("text-status");
    const complaintStatus = statusToggler.innerHTML;
    let body;
    if (complaintStatus == 'On Progress') {
        statusToggler.classList.toggle('btn-primary', false);
        statusToggler.classList.toggle('btn-warning', true);
        textStatus.classList.toggle('status-taken', false);
        textStatus.classList.toggle('status-hold', true);
        statusToggler.innerHTML = 'On Hold';
        textStatus.innerHTML = 'On Hold';
        body = JSON.stringify({
            complaintStatus: 'Hold',
            id: statusToggler.id
        });
    } else if (complaintStatus == 'On Hold') {
        statusToggler.classList.toggle('btn-primary', true);
        statusToggler.classList.toggle('btn-warning', false);
        textStatus.classList.toggle('status-taken', true);
        textStatus.classList.toggle('status-hold', false);
        statusToggler.innerHTML = 'On Progress';
        textStatus.innerHTML = 'On Progress';
        body = JSON.stringify({
            complaintStatus: 'Taken',
            id: statusToggler.id
        });
    }

    // Change ticket status
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/agent-dashboard/live-chat/change-ticket-status");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);
}

function closeTicket() {
    const textStatus = document.getElementById("text-status");
    const body = JSON.stringify({
        complaintStatus: 'Closed',
        id: statusToggler.id
    });

    textStatus.classList.toggle('status-taken', false);
    textStatus.classList.toggle('status-hold', false);
    textStatus.classList.toggle('status-closed', true);
    textStatus.innerHTML = 'Closed';

    // Change ticket status
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/agent-dashboard/live-chat/change-ticket-status");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);
}

function setPassedTo(e) {
    const button = document.querySelector(".passed-agent");
    button.innerHTML = e.innerHTML;
    button.id = e.id;
}

function sendRequest(e) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        let result = JSON.parse(this.responseText);
        if (result.success) {
            document.location.reload();
        }
    }
    if (e.id != "") {
        // Sent forward request
        xhr.open("POST", `/agent-dashboard/live-chat/forward-ticket?recv=${e.id}&&ticket=${statusToggler.id}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }
}