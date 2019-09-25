module.exports = function isUserAuthenticated(req, res, yes, no) {
	if (req.user) {
		yes();
	} else {
		no();
	}
}