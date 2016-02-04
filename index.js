"use strict"

const Nodest = require("nodest");

class NodestSpaces extends Nodest.Extension {

	on(event, arg) {
		
		// boot
		if (event == "boot") {
			// setup namespace
			Nodest.SpaceLoader = require("./lib/spaceloader.js");
			Nodest.Space = require("./lib/space.js");
			
			// load spaces
			this.app.spaces = new Nodest.SpaceLoader(this.app, this.options);
		}
		
		// post-init
		if (event == "post-init") {
			// init spaces
			this.app.spaces.init();
		}
		
		// setup new controller
		if (event == "controller-create") {
			var controller = arg;
			
			// controller.space
			Object.defineProperty(controller, "space", {
				get: () => { 
					return this.app.spaces.find(controller.pathContext.name);
				},
				enumerable: true
			});
			
			// controller.spaces
			Object.defineProperty(controller, "spaces", {
				get: () => { 
					return this.app.spaces;
				},
				enumerable: true
			});
		}
		
	}
}

module.exports = NodestSpaces;
