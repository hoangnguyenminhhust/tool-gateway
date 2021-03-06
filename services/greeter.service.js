"use strict";
const mongoose = require("mongoose");
// const Route = mongoose.model("Api");
const response = require("../libs/response");
const Route = require("../models/route");
const Endpoints = require('../models/endpoint')

module.exports = {
	name: "ConfigApi",


	settings: {

	},

	dependencies: [],


	actions: {
		listAllData: {
			async handler() {
				try {
					let data = await this.getConfig();
				
					return response.success(data);
				} catch (error) {
					return response.error(error);
				}
			}
		},
		// Route 

		listAllRoute: {
			async handler() {
				try {
					let data = await Route.find({});
					this.sendEvent();
					return response.success(data);
				} catch (error) {
					return response.error(error);
				}
			}
		},

		findbyNameRoute: {
			params: {
				name: "string"
			},
			async handler(ctx) {
				try {
					let data = await Route.find({
						name: {
							"$regex": `${ctx.params.name}`,
							"$options": "i"
						}
					});
					return response.success(data);
				} catch (error) {
					return response.error(error);
				}
			}
		},

		deleteRoute: {
			params: {
				_idRoute: "string"
			},
			async handler(ctx) {
				try {
					await Route.findByIdAndDelete({
						_id: ctx.params._idRoute
					});
					this.sendEvent();
					return response.success("Done");

				} catch (error) {
					return response.error(error);
				}
			}
		},

		updateRoute: {
			params: {
				newBody: "object",
				_idRoute: "string"
			},
			async handler(ctx) {
				try {
					await Route.findByIdAndUpdate({
						_id: ctx.params._idRoute
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

		addRoute: {
			params: {
				newBody: {
					type: "object"
				}
			},
			async handler(ctx) {
				try {
					const newRoute = new Route({
						...ctx.params.newBody,
					});
					let check = await Route.findOne(ctx.params.newBody);
					if (!check) {
						await newRoute.save();
						this.sendEvent();
						return response.success(newRoute);
					} else {
						throw new Error('Exist')
					}
				} catch (error) {
					return response.error(error);
				}
			}
		},
		// endpoint


		updateEndpoint: {
			params: {
				newBody: "object",
				_idEndpoint: "string"
			},
			async handler(ctx) {
				try {
					const EndpointCheck = await Endpoints.findOne(
						ctx.params.newBody
					)
					if (EndpointCheck) {
						return response.error("Exist Endpoint of This Route ")
					} else {
						await Endpoints.findOneAndUpdate({
							_id: ctx.params._idEndpoint
						}, ctx.params.newBody, {
							new: true
						})
						this.sendEvent();
						return response.success("Update Success");
					}

				} catch (error) {
					return response.error(error);
				}
			}
		},

		addEndpoint: {
			params: {
				newBody: {
					type: "object"
				},
				_idRoute: "string"
			},
			async handler(ctx) {
				let check = await Endpoints.findOne({
					method: ctx.params.newBody.method,
					path: ctx.params.newBody.path,
					handler: ctx.params.newBody.handler,
					routeId: ctx.params._idRoute
				})
				if (check) {
					return response.error({
						message: "Exist"
					})
				} else {
					const endpoint = new Endpoints({
						...ctx.params.newBody,
						routeId: ctx.params._idRoute
					})
					await endpoint.save()
					this.sendEvent();
					return response.success(endpoint)

				}
			}

		},

		deleteEndpoint: {
			params: {
				_idEndpoint: "string"
			},
			async handler(ctx) {
				try {
					await Endpoints.findOneAndDelete({
						_id: ctx.params._idEndpoint
					})
					this.sendEvent();
					return response.success("Delete Success")
				} catch (error) {
					return response.error(error)
				}
			}
		},

		listAllEndpoint: {
			async handler() {
				try {
					let data = await Endpoints.find({});
					this.sendEvent();
					return response.success(data);
				} catch (error) {
					return response.error(error);
				}
			}
		},

		sendEventConfig() {
			this.sendEvent()
		}
	},

	/**
	 * Events
	 */
	events: {
		"ConfigApi.Changed"(data) {
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
				this.broker.broadcast("ConfigApi.Changed", data);
			} catch (error) {
				return error
			}
		},

		async getConfig() {

			let configs = []
			let routes = await Route.find({})


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
				
				let config = {
					"name": route.name,
					"path": route.path,
					"authentication": route.authentication,
					"endpoints": endpoints
				}
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