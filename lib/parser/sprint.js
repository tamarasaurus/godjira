var _ = require('underscore');

module.exports = (function() {

	var sprint = function() {

		this.getActive = function(sprints) {

		};

		this.normaliseIssues = function(issues) {
			var _this = this;
			var parsed = [];
			_.each(issues, function(i) {
				parsed.push(_this.normaliseIssue(i));
			});
			return parsed;
		};

		this.normaliseIssue = function(issue) {
			return _.extend(issue, {
				fields: {
					priority: {
						name: issue.priorityName,
						id: ''
					},
					summary: issue.summary,
					issuetype: {
						name: issue.typeName
					},
					status: issue.status,
					description: issue.description,
					story_points: issue.estimateStatistic.statFieldValue.value || ''
				}
			});
			// return an object that is structured the same way as the regular ones.
		};


	};

	return sprint;
}());