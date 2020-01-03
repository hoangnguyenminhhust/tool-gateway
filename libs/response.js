module.exports = {
	success(data) {
		return {
			code: 200,
			success: true,
			data: data,
		};
	},
	error(error) {
		return {
			code: 500,
			success: false,
			message: error.message,

		};
	}
};