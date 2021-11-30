const jwt = require('jsonwebtoken');

const secretKey = 'secret';

function CreateToken (data, expired) {
	return jwt.sign(data, secretKey, { expiresIn: expired });
}

function VerifyToken (token) {
	return jwt.verify(token, secretKey);
}

module.exports = {
	CreateToken,
	VerifyToken
}