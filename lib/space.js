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
	* Sets up a controller route for the space
	* @param {string} path The path to match for the route
	* @param {string|Nodest.Controller} controller The Controller to dispatch. Can be a Nodest.Controller derived class or a path to a file that exports a controller.
	*/
	route(path, controller) {
		this.app.route(path, controller, this.pathContext);
	}
	
	/**
	* Sets up a controller route for the space
	* @param {string} routerName name of router
	* @param {string} path The path to match for the route
	* @param {string|Nodest.Controller} controller The Controller to dispatch. Can be a Nodest.Controller derived class or a path to a file that exports a controller.
	*/
	routeFor(routerName, path, controller) {
		this.app.route(path, controller, this.pathContext);
	}
	
	/**
	* Removes a controller route for the application
	* @param {string} path The path to match for the route
	*/
	deroute(path) {
		this.app.deroute(path);
	}
	
	/**
	* Removes a named controller route for the application
	* @param {string} routerName name of router
	* @param {string} path The path to match for the route
	*/
	derouteFor(routerName, path) {
		this.app.derouteFor(routerName, path);
	}
	
	/**
	* Use middleware as derived from Nodest.Middleware
	* @param {string|Nodest.Middleware} middleware The path or class of middleware to use.
	*/
	use(middleware) {	
		this.app.use(middleware, this.pathContext);
	}
}

module.exports = Space;