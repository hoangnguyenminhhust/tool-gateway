const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ApiSchema = new Schema({
	name : String ,
	path: String,
	authentication: {
		type: Boolean,
		default : false
	},
	authorziration : {
		type: Boolean,
		default: false
	},
	endpoints: Array
	
});

module.exports = mongoose.model("Api" , ApiSchema );