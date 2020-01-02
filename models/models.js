const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ApiSchema = new Schema({
	config :  { type: Object,
		unique : true,

		method : String,
		path: String, 
	},
	handler : String
	
});

module.exports = mongoose.model("Api" , ApiSchema );