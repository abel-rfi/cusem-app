const test = (req, res) => {
	try {
		res.send("Hello World");
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

module.exports = {
	test
}