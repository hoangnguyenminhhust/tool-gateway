"use strict";
const mongoose = require("mongoose");
// const apiSchema = mongoose.model("Api");
const response = require("../libs/response");
const apiSchema = require("../models/models");
const Endpoints = require('../models/endpoint')

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
					//console.log(ctx.params)
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
		},
		updateEndpoint: {
			params: {

				_id: "string"
			},
			async handler(ctx) {
				const endpoint = await Endpoints.findOne({
					routeId: ctx.params._id
				})
				endpoint.method = "GET"
				await endpoint.save()

				return endpoint

			}
		},

		addEndpoint: {
			params: {
				api: {
					type: "object"
				},
				_id: "string"
			},
			async handler(ctx) {

				console.log(ctx.params)
				const endpoint = new Endpoints({
					...ctx.params.api,
					routeId: {
						_id: ctx.params._id
					}
				})
				try {

					await endpoint.save()



					return response.success(endpoint)
				} catch (error) {
					return response.error(error)
				}
			}

		},

		createEndpoint: {
			handler(ctx) {
				console.log(ctx)
			}
		},
		sendEventService() {
			this.sendEvent()
		}
	},

	/**
	 * Events
	 */
	events: {
		"ApiManage.Changed"(data) {
			console.log(data)
		},
	},

	/**
	 * Methods
	 */
	methods: {
		async sendEvent() {
			try {
				

				const data = await this.getConfig()

				this.broker.broadcast("ApiManage.Changed", data);
			} catch (error) {
				return error
			}
		},

		async getConfig() {

			let configs = []
			let routes = await apiSchema.find({})


			for (let i = 0; i < routes.length; i++) {
				let config = await this.findEndpoint(routes[i])
				configs.push(config)
			}

			return configs

		},

		async findEndpoint(route) {

			try {
				let endpoints = await Endpoints.find({
					routeId: route._id
				})
				console.log(endpoints)
				let config = {
					"name": route.name,
					"path": route.path,
					"authentication": route.authentication,
					"endpoints": endpoints
				}
				//console.log(config)
				return config
			} catch (error) {
				return error
			}

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