var _ = require('underscore');

module.exports = (function() {

	var user = function() {

		this.item = {};

		this.setUser = function(user) {
			this.item = user;
		};

        this.getDetails = function(req, res, callback, config, jira){
            var params = this.getParams(req, config);
            jira.getUsersIssues(params.username, params.opts, params.open, function(e, response, body) {
                if (!_.isUndefined(callback)) {
                    callback(response);
                }
            });
        };

		this.getUsername = function(nickname, friends) {
			var username = false;

			_.each(friends, function(f) {
				if (f.nickname === nickname) {
					username = f.username;
				}
			});
			return username;
		};

		this.getParams = function(req, config) {
			var username = this.getUsername(req.params.nickname, config.friends);
			var open = false;
			var opts = {
				order: 'created',
				sort: 'asc'
			};

			if (!username) {
				username = req.params.nickname;
			}

			if (!_.isUndefined(req.query.status)) {
				open = true;
			}

			if (!_.isUndefined(req.query.orderby)) {
				opts.order = req.query.orderby;
			}

			if (!_.isUndefined(req.query.sortby)) {
				opts.sort = req.query.sortby;
			}
			return {
				username: username,
				opts: opts,
				open: open
			};
		};

	};


	return user;
}());