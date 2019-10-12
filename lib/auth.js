module.exports = function isUserAuthenticated(req, res, yes) {
	if (req.user) {
		console.log('logined')
		yes();
	} else {
		res.status(401).send("Please login");
	}
}