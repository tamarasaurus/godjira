var _ = require('underscore');
var S = require('string');

module.exports = (function() {

	var rapid = function() {

		this.getRapidsFromProject = function(response, project) {
			var check = [('project = ' + project.key).toLowerCase(), ('project = "' + project.name+'"').toLowerCase()];
			var rapids = [];

			_.each(response, function(view) {
				if (S(view.filter.query.toLowerCase()).contains(check[0]) || S(view.filter.query.toLowerCase()).contains(check[1])){
					rapids.push(view);
				}
			});
            return rapids;
		};

	};

	return rapid;
}());