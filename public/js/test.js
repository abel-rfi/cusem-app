const ratingForm = document.querySelector('.rating-form');
var i;
var starVal = 1;

ratingForm.addEventListener('submit', e => {
	e.preventDefault();
	// console.log(e.target.elements);
	for ( i = 0; i < 5; i++ ) {
		if (e.target.elements[i].value * e.target.elements[i].checked > starVal) {
			starVal = e.target.elements[i].value;
		}
		if (e.target.elements[i].value == 1) {
			e.target.elements[i].checked = true;
		}
	}
	const data = {
		rating: starVal,
		comment: e.target.elements[5].value
	}
	e.target.elements[5].value = ""
	
	console.log(data);
	location.replace('');
});