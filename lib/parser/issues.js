var _ = require('underscore');

module.exports = (function() {

	var issues = function() {

		this.groupByPerson = function(issues) {
			var grouped = _.groupBy(issues, function(i) {
				return i.assignee;
			});
			return grouped;
		};
		// order issues by status
		this.orderByStatus = function(issues, status) {
			var ordered = _.sortBy(issues, function(i) {
				if (!_.isUndefined(i.status)) {
					return i.status.id;
				} else {
					return i.fields.status.id;
				}
			});
			return ordered;
		};
	};

	return issues;
}());