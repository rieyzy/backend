const jwt = require('jsonwebtoken');


// Used to sign and confirm if the token is recognized/can be authenticated by our server app.
const secret = "CarrieBackend";


// Token Creation
module.exports.createAccessToken = (user) => {

	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	return jwt.sign(data, secret, {});
};


module.exports.verify = (req, res, next) => {
	console.log(req.headers.authorization);

	
	let token = req.headers.authorization;

	
	if(typeof token === "undefined") {
		return res.send({auth: "Failed. No Token received."});
	} else {
		
		token = token.slice(7, token.length);

		
	}
	
	jwt.verify(token, secret, function(err, decodedToken) {
		if(err) {
			return res.send({
				auth: "Failed",
				message: err.message
			});
		} else {

			req.user = decodedToken;
			next();
		}
	})
};


// verifyAdmin function 
module.exports.verifyAdmin = (req, res, next) => {

	console.log(req.user);
	if(req.user.isAdmin) {
		next();
	} else {
		return res.send({
			auth: "Failed",
			message: "Action Forbidded"
		})
	}
};