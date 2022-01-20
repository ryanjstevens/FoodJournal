var Dom = (function() { /*

class Dom {
	// Utilities for interacting with the shitty document object model */
	Node.prototype.add = function (string) {
		var node;

		if (Kit.getType(string) == "String") {
			var fragment = document.createRange().createContextualFragment(string);
			while (fragment.children.length > 0) {
				this.appendChild(fragment.children[0]);
			}
		} else {
			if (string != null) {
				this.appendChild(string);
			}
		}
	}

	// Node.prototype.remove = function () {
	// 	// Removes this object from its parent (and the rest of the DOM)
	// 	// if (type == "string") {
	// 	// 	document.getElementsByTagName(node)[0];
	// 	// }
	// 	this.remove();
	// }

	Node.prototype.replace = function (string) {
		var parent = this.parentNode;
		this.remove();
		parent.add(string);
	}


	// Node.prototype.children = function (node) {
	// 	return node.children;
	// }

	Node.prototype.length = function (node) {
		return node.childElementCount;
	}

	Node.prototype.get = function (ref, parent = document) {
		var type = Kit.getType(ref);

		switch (type) {
			case "_string":
				// All of these methods search the entire DOM.  Useless.
				var result;
				var tempArr;

				// IDs
				if (result == null) {
					result = parent.getElementById(ref);
				}

				// Nodes names
				if (result == null) {
					
					tempArr = parent.getElementsByTagName(ref);
					if (tempArr != null) {
						result = tempArr[0];
					}
				}

				// Name Properties
				if (result == null) {
					tempArr = null;
					tempArr = parent.getElementsByName(ref)[0];
					if (tempArr != null) {
						result = tempArr[0];
					}
				}

				// Classes
				if (result == null) {
					tempArr = null;
					tempArr = parent.getElementsByClassName(ref)[0];
					if (tempArr != null) {
						result = tempArr[0];
					}
				}

				break;
			case "String":
			// 	var ids = parent.getElementById(ref);
			// 	var nodes = parent.getElementsByTagName(ref);
			// 	var names = parent.getElementsByName(ref);
			// 	var classes = parent.getElementsByClassName(ref);

				break;
			case "Number":
				if (ref , this.children.length) {
					return this.children[ref];
				} else {
					return null
				}
				
				break;
		}
	}

	Node.prototype.type = function () {
		return this.nodeName.toLowerCase()
	}

	Node.prototype.list = function (depth = 0) {			
		for (var i = 0; i < this.children.length; i++) {
			var node = this.children[i];
			if (node.children.length > 0) {
				Debug.print(Kit.charPad(depth, "  ") + i + ": " + node.nodeName.toLowerCase() +  "(" + Kit.getType(node) + ")  ¬", false);
				node.list(depth + 1);
			} else {
				Debug.print(Kit.charPad(depth, "  ") + i + ": " + node.nodeName.toLowerCase() +  "(" + Kit.getType(node) + ")", false);
			}
		}
	}

	Node.prototype.has = function (ref) {
		if (this.getChildByName(ref)) {
			return true;
		} else {
			return false;
		}
	}

	Node.prototype.dump = function () {
		if (this.numChildren > 0) {
			for (var i = this.numChildren-1; i > -1; i--) {
				Kit.remove(this.get(i), true);
			}
		}
	}


	function constructor() {
		if (typeof Debug !== "undefined") {
			Debug.print("Dom Loaded");
		} else {
			console.log("Dom Loaded");
		}
	}
	constructor();

	// Public Accessos
	return {
		// "add":add,
		// "remove":remove,
		// "replace":replace,
		// "children":children,
		// "length":length,
		// "get":get,
		// "list":list,
		// "has":has,
		// "dump":dump
	}
}

)()