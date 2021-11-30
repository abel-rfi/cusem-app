const token = localStorage.getItem('token');
// console.log(token)

if (token != null) {
	localStorage.removeItem('token')
	location.replace(`/customer-website/logged/?token=${token}`)
}