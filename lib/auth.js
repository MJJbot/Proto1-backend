module.exports = function isUserAuthenticated(req, res, yes, no) {
	if (req.user) {
		console.log('logined')
		yes();
	} else {
		console.log('logined')
		no();
	}
}