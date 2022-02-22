const removeCookies = (res) => {
	res.cookie("accessToken", "logout", { expires: new Date(Date.now()) });
	res.cookie("refreshToken", "logout", { expires: new Date(Date.now()) });
};

module.exports = removeCookies;
