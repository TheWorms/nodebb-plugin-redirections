"use strict";

var Settings = module.parent.require('./settings'),
	PropertyFileWatcher = require('./lib/PropertyFileWatcher'),
	plugin = {};

plugin.init = function(params, callback) {

	plugin.settings = new Settings('modebb-plugin-redirections', '0.1', defaultSettings, function() {
		// the settings are ready and can accessed.
		plugin.redirections = new PropertyFileWatcher(
			this.get('redirections'), {
				transform: function(data) {
					return data.redirections.map(function(redir) {
						return {
							origin: new RegExp("^" + redir.origin + "$", "i"),
							site: nconf.get("domains")[redir.destination],
							path: redir.path || ""
						}
					});
				}
			}
		);
	});



	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/redirections', hostMiddleware.admin.buildHeader, plugin.renderAdminPage);
	router.get('/api/admin/plugins/redirections', plugin.renderAdminPage);

	callback();
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/redirections',
		icon: 'fa-tint',
		name: 'Redirections'
	});

	callback(null, header);
};

plugin.renderAdminPage = function (req, res, next) {
	/*
		Make sure the route matches your path to template exactly.

		If your route was:
			myforum.com/some/complex/route/
		your template should be:
			templates/some/complex/route.tpl
		and you would render it like so:
			res.render('some/complex/route');
	*/

	res.render('admin/plugins/redirections-settings', {});
};
module.exports = plugin;
