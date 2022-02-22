const buttons = document.getElementsByClassName("historyChat");

// Event Listener Section

for (var i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', e => {
		e.preventDefault();
		if (e.target.id != '') {
			this.getChat(e.target.id);
		} else {
			const monitor = document.getElementById("historyMonitor");
			monitor.innerHTML = '';
		}
	});
}

// Function Section

function getChat(id) {
	const xhttp = new XMLHttpRequest();
	console.log("get chats");
	xhttp.onload = function() {
		const monitor = document.getElementById("historyMonitor");
		monitor.innerHTML = '';
		let chats = JSON.parse(this.responseText);
		// console.log(chats);
		for (var i = 0; i < chats.length; i++) {
			const div = document.createElement('div');
			div.classList.add("chat");
			if (chats[i].sender == 'user') {
				div.classList.add("right");
				div.classList.add("chat-client");
				div.classList.add("bg-light");
				div.classList.add("text-dark");
			} else {
				div.classList.add("left");
				div.classList.add("bg-primary");
			}
		    div.innerHTML = `${chats[i].message}`;
		    monitor.appendChild(div);
		}
	}
	xhttp.open("POST", `/agent-dashboard/ticket-archieve/get-chat?id=${id}`);
	xhttp.send();
}