var fs = require("fs-extra"),
	yfm = require('yaml-front-matter');

function PropertyFileWatcher(path, options) {
	var i = this;
	i._path = path;
	i._options = options;

	i._watcher = fs.watch(path, (eventName, fileName) => {
		switch (eventName) {
			case "change":
				console.log("Reload file " + fileName);
				i.reload();
				break;

			default:
				console.debug("Received " + eventName + " on file " + fileName);
				break;
		}
	});
	i.reload();
}

PropertyFileWatcher.prototype = {
	get: function() {
		return this._data;
	},
	reload: function() {
		var i = this;
		try {
			i._data = yfm.loadFront(i._path);
		} catch (err) {
			console.error("ERROR parsing YAML values : " + i._path);
			console.error(err);
		}
		if (i._options.transform) {
			i._data = i._options.transform(i._data);
		}
	}
}

module.exports = PropertyFileWatcher;
