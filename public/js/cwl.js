const categoryForm = document.getElementById('cust-live-chat-category-section');
const liveChatSection = document.getElementById('cust-live-chat-log');
const ratingSection = document.getElementById('live-chat-rating');
const chatMonitor = document.querySelector('.cust-live-chat-chat-section');
const liveChatButton = document.querySelector(".live-chat");

// Global Variable
const client = document.querySelector('.client-name').innerHTML;

// Socket Section

const socket = io();

socket.on('user-message', msg => {
    console.log(`'${msg}' <= Me`);
    this.outputMessage(msg);
});

socket.on('server-message', msg => {
    console.log(`'${msg}' <= Server`);
    this.outputMessageServer(msg);
});

socket.on("connect_error", (err) => {  
    console.log(`connect_error due to ${err.message}`);
});

// Event Listener Section

categoryForm.addEventListener('submit', e => {
    e.preventDefault();

    if (e.target.elements[0].value != '-'){
        console.log(e.target.elements[0].value);
        var category = e.target.elements[0].value;

        // Generate Room Id
        var room = this.createUUID();
        // Save Room Id in Web Cookie
        this.saveRoomId(room, 3);
        console.log(room);

        // Create LC Ticket
        const body = JSON.stringify({
            roomId: room,
            complaintCategory: category
        });

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/customer-website/logged/create-ticket");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(body);
        
        socket.emit('join-ticket', {room, user: client});
        this.openLC();
    }
});

liveChatSection.addEventListener('submit', e => {
    e.preventDefault();
    this.sendMessage();
});

ratingSection.addEventListener('submit', e => {
    var starVal = 1;
    e.preventDefault();

    for ( i = 0; i < 5; i++ ) {
        if (e.target.elements[i].value * e.target.elements[i].checked > starVal) {
            starVal = e.target.elements[i].value;
        }
        if (e.target.elements[i].value == 1) {
            e.target.elements[i].checked = true;
        }
    }

    e.target.elements[5].value = ""
    this.closeSection();
});

// Function Section

function openCategory() {
    const roomId = this.getRoomId();
    if (roomId == "" || roomId == undefined){
        liveChatButton.classList.toggle("deactive", true);
        categoryForm.classList.toggle("active", true);
    } else {
        this.openLC();
        socket.emit('join-ticket', {roomId, user: client});
    }
}

function openLC() {
    liveChatButton.classList.toggle("deactive", true);
    liveChatSection.classList.toggle("active", true);
}

function openRating() {
    liveChatButton.classList.toggle("deactive", true);
    ratingSection.classList.toggle("active", true)
}

function closeSection() {
    categoryForm.classList.toggle("active", false);
    liveChatSection.classList.toggle("active", false);
    ratingSection.classList.toggle("active", false);
    liveChatButton.classList.toggle("deactive", false);
}

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function saveRoomId(value, h) {
    const day = new Date();
    day.setTime(day.getTime() + (h * 60 * 60 * 1000));
    let expires = "expires=" + day.toUTCString();

    document.cookie = `roomId = ${value}; ${expires}; path=/`;
}

function getRoomId() {
    let cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        let [key, value] = cookies[i].split('=');
        if (key == "roomId") {
            return value;
        }
    }
}

function removeRoomId() {
    document.cookie = `roomId = ; path=/`;
}

function sendMessage() {
    const chatForm = document.querySelector('.cust-live-chat-input-section');
    const msg = chatForm.children.msg.value;
    
    console.log(`Me => '${msg}'`);
    const roomId = this.getRoomId();
    socket.emit('user-message', {roomId, msg});

    // Create LC Ticket
    const body = JSON.stringify({
        roomId,
        msg
    });

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/customer-website/logged/save-chat");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);

    chatForm.children.msg.value = '';
    chatForm.children.msg.focus();
}

function outputMessage(msg) {
    const div = document.createElement('div');
    div.classList.add("cust-live-chat-chat");
    div.innerHTML = `${msg}`;

    chatMonitor.appendChild(div);
}

function outputMessageServer(msg) {
    const div = document.createElement('div');
    div.classList.add("cust-live-chat-chat");
    div.classList.add("server-chat");
    div.innerHTML = `${msg}`;

    chatMonitor.appendChild(div);
}