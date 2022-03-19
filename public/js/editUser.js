const fillDataForm = document.getElementById('editProfile');
const changePasswordForm = document.getElementById('changePassword');

fillDataForm.addEventListener('submit', e => {
    e.preventDefault();

    const body = JSON.stringify({
        "agentName": e.target.agentName.value,
        "agentAddress": e.target.agentAddress.value,
        "agentPhone": e.target.agentPhone.value
    });
    // console.log(body);

    // Make Request
    fetch('/agent-dashboard/edit-profile/fill-data', {
        method: 'post',
        body,
        headers: new Headers({'Content-Type': 'application/json'})
    })
    .then(response => console.log(response));
});

changePasswordForm.addEventListener('submit', e => {
    e.preventDefault();

    if (e.target.agentPassword.value != e.target.agentConfirmPassword.value) {
        return ;
    }

    const body = JSON.stringify({
        "oldPassword": e.target.oldAgentPassword.value,
        "password": e.target.agentPassword.value
    });
    
    // Make Request
    fetch('/agent-dashboard/edit-profile/change-password', {
        method: 'post',
        body,
        headers: new Headers({'Content-Type': 'application/json'})
    })
    .then(response => {
        console.log(response);
        e.target.oldAgentPassword.value = "";
        e.target.agentPassword.value = "";
        e.target.agentConfirmPassword.value = "";
    });
});

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