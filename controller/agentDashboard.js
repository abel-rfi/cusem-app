const test = (req, res) => {
	try {
		res.send("Test");
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderMain = (req, res) => {
	try {
		res.render('agentDashboardLC', {layout: 'agentDashboardLC'});
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderCS = (req, res) => {
	try {
		res.render('agentDashboardLCCS', {layout: 'agentDashboardLC'});
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderFS1 = (req, res) => {
	try {
		res.render('agentDashboardLCFS1', {layout: 'agentDashboardLC'});
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderFS2 = (req, res) => {
	try {
		res.render('agentDashboardLCFS2', {layout: 'agentDashboardLC'});
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

module.exports = {
	test,
	renderMain,
	renderCS,
	renderFS1,
	renderFS2
}