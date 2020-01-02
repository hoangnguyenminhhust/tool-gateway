"use strict";
const mongoose = require("mongoose");
// const apiSchema = mongoose.model("Api");
const response = require("../libs/response");
const apiSchema = require("../models/models");
module.exports = {
	name: "ApiManage",

	/**
	 * Service settings
	 */
	settings: {

	},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Say a 'Hello'
		 *
		 * @returns
		 */
		hello() {
			return "Hello Moleculer";
		},

		/**
		 * Welcome a username
		 *
		 * @param {String} name - User name
		 */
		welcome: {
			params: {
				name: "string"
			},
			handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
			}
		},
		listAll: {
			async handler() {
				try {
					let data = await apiSchema.find({});
					return response.success(data);
				} catch (error) {
					return response.error(error);
				}
			}
		},

		findbyName: {
			params: {
				path: "string"
			},
			async handler(ctx) {
				try {
					let data = await apiSchema.find({
						config: {
							path: {
								"$regex": `${ctx.params.params}`,
								"$options": "i"
							}
						}

					});
					return response.success(data);
				} catch (error) {
					return response.error(error);
				}
			}
		},

		delete: {
			params: {
				_id: "string"
			},
			async handler(ctx) {
				try {
					await apiSchema.findByIdAndDelete({
						_id: ctx.params._id
					});
					this.sendEvent();
					return response.success("Done");

				} catch (error) {
					return response.error(error);
				}
			}
		},

		update: {
			params: {
				newBody: "object",
				_id: "string"
			},
			async handler(ctx) {
				try {
					await apiSchema.findByIdAndUpdate({
						_id: ctx.params._id
					}, ctx.params.newBody, {
						new: true
					});
					this.sendEvent();
					return response.success("Update Success");

				} catch (error) {
					return response.error(error);
				}
			}
		},

		create: {
			params: {
				api: {
					type: "object"
				}
			},
			async handler(ctx) {

				try {
					const newApi = new apiSchema(ctx.params.api);
					let check = await apiSchema.findOne(ctx.params.api);
					
					if (!check) {
						await newApi.save();
						this.sendEvent();
						return newApi;
					} else {
						return "Existe";
					}


				} catch (error) {
					return error;
				}
			}
		}
	},

	/**
	 * Events
	 */
	events: {
		"ApiManage.Changed"(data) {
			return ("api created:", data);
		},
	},

	/**
	 * Methods
	 */
	methods: {

		sendEvent() {
			let data = apiSchema.find({});
			this.broker.broadcast("ApiManage.Changed", data);
		}

	},
	run() {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {
		mongoose.connect("mongodb://localhost:27017/api", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		}, (err) => {
			if (!err) console.log("connected database");
		});
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};