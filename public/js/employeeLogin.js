if (localStorage.getItem('agentId')) {
    location.replace(`/agent-dashboard?id=${localStorage.getItem('agentId')}`);
}

function show() {
    var pssw = document.getElementById("password");
    var hide = document.getElementById('show');

    if (pssw.type == "password" ) {
        pssw.type = "text";
        hide.innerHTML = 'show';
    } else {
        pssw.type = "password";
        hide.innerHTML = 'hide';
    }
}