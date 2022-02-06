// get query
const queryString = location.search;
const query = new URLSearchParams(queryString);
const id = query.get('id');
const ticket = query.get('ticket');

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

