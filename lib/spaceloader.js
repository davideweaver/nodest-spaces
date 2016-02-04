"use strict";

const Nodest = require("nodest");
const Path = require("path");
const Process = require("process");
const Filesystem = require("fs");

class SpaceLoader {
	constructor(app, path, options) {	
		this.spaces = {};
		this.log = Nodest.Log.scoped("spaces");
		
		Object.defineProperty(this, "app", {enumerable: true, value: app});
		Object.defineProperty(this, "path", {enumerable: true, value: path});
		Object.defineProperty(this, "options", {enumerable: true, value: options});
		Object.defineProperty(this, "fullPath", {enumerable: true, value: Path.join(app.cwd(), path)});
		
		this.loadSpaces();
	}
	
	/**
	* Initialize the loaded spaces
	* @private
	*/
	init() {
		for (var key in this.spaces) {
			this.spaces[key].init();
		}
	}
	
	/**
	* Loads spaces
	* @private
	*/
	loadSpaces() {
		var base = this;
		var p = this.fullPath;
		try {
			var statSpaces = Filesystem.lstatSync(p);
			if (statSpaces.isDirectory()) {
				var files = Filesystem.readdirSync(p);
				var f, l = files.length;
				for (var i = 0; i < l; i++) {
					f = Path.join(p, files[i]);
					var stat = Filesystem.lstatSync(f);
					if (stat.isDirectory()) {
						var name = Path.basename(f);
						this.log.debug("found space: " + name);
						var SpaceCls = require(f);
						var pathContext = new Nodest.PathContext(name, f);
						base.spaces[name] = new SpaceCls(pathContext, this.app, name);
						
						this.app.extensions.emit("space-create", base.spaces[name]);
					}
				}
			}
		} 
		catch(e) {
			// ignore missing spaces directory
			if (e.code && e.code == "ENOENT")
				return;
				
			// otherwise error out
			this.log.error(e);
			throw e;
		}
	}
	
	/**
	* Gets a space based on a path/name
	* @private
	* @param {string} path Path (or name) of requested space
	* @return {Nodest.Space}
	*/
	find(path) {
		var rp = this.fullPath;
		if (rp[rp.length - 1] != "/")
			rp += "/";
		rp = path.replace(rp, "");
		var nextToken = rp.indexOf("/");
		if (nextToken >= 0)
			rp = rp.substring(0, nextToken);
		return this.spaces[rp];
	}
	
	/**
	* Loads the exports of a space
	* @param {string} name Name of required space
	* @return any
	*/
	require(name) {
		return this.spaces[name].export();
	}
}

module.exports = SpaceLoader;