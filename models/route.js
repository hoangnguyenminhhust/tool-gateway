const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ApiSchema = new Schema({
	name : String ,
	path: String,
	authentication: {
		type: Boolean,
		default : false
	},


});

module.exports = mongoose.model("Api" , ApiSchema );