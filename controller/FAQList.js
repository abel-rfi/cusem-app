
const test = (req, res) => {
	try {
		res.send("Send Login");
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}
const render = (req, res) => {
	try {
		res.render('FAQlist', {layout: 'FAQlistLayout'})
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderAgent = (req, res) => {
	try {
		res.render('FAQagent', {layout: 'FAQAgentLayout'})
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderAdmin = (req, res) => {
	try {
		res.render('FAQadmin', {layout: 'FAQAdminLayout'})
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

module.exports = {
	test,
	render,
	renderAgent,
	renderAdmin
}
