var loginSection = document.getElementById("log-section");
var registerSection = document.getElementById("log-section-r");
var chatSection = document.getElementById("cust-live-chat-no-log");
var liveChatButton = document.querySelector(".live-chat");

function openChat() {
	this.closeAll();
	chatSection.classList.toggle("active");
	liveChatButton.classList.toggle("deactivate");
}

function openLogin() {
	this.closeAll();
	loginSection.classList.toggle("active");
}

function openRegister() {
	this.closeAll();
	registerSection.classList.toggle("active");
}

function closeAll() {
	chatSection.classList.toggle("active", false);
	loginSection.classList.toggle("active", false);
	registerSection.classList.toggle("active", false);
	liveChatButton.classList.toggle("deactivate", false);
}