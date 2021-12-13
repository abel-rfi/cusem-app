// Get query
const queryString = location.search;
const query = new URLSearchParams(queryString);
const agentId = query.get('id');

// store agent session
localStorage.setItem('agentId', agentId);

var questions = document.getElementsByClassName("faq-question-section");
var i;
var icon;

for (i=0; i < questions.length; i++) {
	questions[i].addEventListener("click", function () {
		// console.log('clicked');
		// console.log(this.innerHTML)
		
		icon = this.childNodes[3];
		if (icon.innerHTML === "-"){
			icon.innerHTML = "+";
		} else {

			icon.innerHTML = "-"
		}

		this.classList.toggle("active");
		var answer = this.nextElementSibling;
		if (answer.style.maxHeight) {
			answer.style.maxHeight = null;
		} else {
			answer.style.maxHeight = answer.scrollHeight + "px";
		}
	});
}

function logOut() {
	localStorage.removeItem('agentId');
	location.replace('/employee-login-page');
}

function EditProfile() {
	location.replace(`/agent-list-page/open-agent/${agentId}`)
}