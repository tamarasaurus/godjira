/**
 * SettingsController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var _ = require('underscore');
module.exports = {
	show: function(req, res) {

        res.locals.jira.getProjects(function(e, response){
            // console.log(res.locals.jira);

            // console.log(response);

            if(e){
                console.log(e);
                return res.send('Get projects failed');
            }

            // console.log(projects);

            res.view('settings/show', {
                username: req.user[0].nickname
            });
        });

	},

	update: function(req, res) {
		User.findOne(req.user[0].id).done(function(error, u) {
			if (error) {
				return res.send(403, {
					message: 'Not Authorized'
				});
			}
			User.update({
				id: u.id
			}, req.body, function(err, user) {
				if (!err) {
					return res.send('success');
				}
			});
		});
	},



	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to UserController)
	 */
	_config: {}


};