const jwt = require('jsonwebtoken');

const secretKey = 'secret';

exports.CreateToken = function (data, expired) {
	return jwt.sign(data, secretKey, { expiresIn: expired });
}

exports.VerifyToken = function (token) {
	return jwt.verify(token, secretKey);
}

exports.checkTokenAgent = async (req, res, next) => {
	const { agentToken } = req.cookies;
	// console.log(agentToken);
	jwt.verify(agentToken, secretKey, (err, decoded) => {
		if (err) {
			res.redirect('/employee-login-page');
		} else {
			req.body.decoded = decoded;
			next();
		}
	});
}

exports.checkToken = async (req, res, next) => {
	const { token } = req.cookies;
	jwt.verify(token, secretKey, (err, decoded) => {
		if (err) {
			console.log("Error parsing token");
			res.redirect('back');
		} else {
			req.body.decoded = decoded;
			next();
		}
	});
}