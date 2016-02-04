"use strict";

const Nodest = require("nodest");

/**
* Base class for a space. Derive your space from this class.
* @class
*/
class Space {
	
	constructor(pathContext, app, name) {
		Object.defineProperty(this, "pathContext", {enumerable: true, value: pathContext});
		Object.defineProperty(this, "app", {enumerable: true, value: app});
		Object.defineProperty(this, "name", {enumerable: true, value: name});	
		
		// setup log
		this.log = Nodest.Log.scoped(name);
	}
	
	/**
	* Override this to initialize your space
	*/
	init() {
	}
	
	/**
	* Override this to return an exported API for your space
	*/
	export() {
		return {};
	}
	
	/**
	* Sets up a controller route for the application
	* @param {string} path The path to match for the route
	* @param {string|Nodest.Controller} controller The Controller to dispatch. Can be a Nodest.Controller derived class or a path to a file that exports a controller.
	*/
	route(path, controller) {
		this.app.routers.route(path, controller, this.pathContext);
	}
	
	/**
	* Removes a controller route for the application
	* @param {string} path The path to match for the route
	*/
	deroute(path) {
		this.app.router.deroute(path);
	}
}

module.exports = Space;