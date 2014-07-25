'use strict';

// Dependencies
var _ = require('underscore'),
config = require('./config'),
express = require('express'),
app = express();

// Parsers
var Project = require('./lib/parser/project'),
User = require('./lib/parser/user'),
Rapid = require('./lib/parser/rapid'),
Sprint = require('./lib/parser/sprint');
var user = new User(),
project = new Project(),
rapid = new Rapid(),
sprint = new Rapid();


// Jira api
var Jira = require('jira-tamarasaurus').JiraApi,
jira = new Jira('https', config.host, config.port, config.user, config.password, '2');

// App settings
app.set('views', __dirname + '/views/');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

// put routes in a separate file
// make another file to parse route params

app.get('/project/:key', function(req, res) {
	jira.getProject(req.params.key, function(e, response, body) {
		console.log(project.set(response));
		res.render('project', {
			'project': JSON.stringify(project.set(response))
		});
		// res.json();
	});
});


var getUserDetails = function(req, res, callback, open) {
	var params = user.getParams(req, open, config);
	jira.getUsersIssues(params.username, params.opts, params.open, function(e, response, body) {
		if (!_.isUndefined(callback)) {
			callback(response);
		}
	});
};

app.get('/people/:nickname/issues', function(req, res) {
	getUserDetails(req, res, function(response) {
		console.log(response);
		// .fields.customfield_10540
		res.json(response);
	});
});

app.get('/people/:nickname', function(req, res) {
	getUserDetails(req, res, function(response) {
		console.log(response);
		res.render('person', {
			'resource': response
		});
	});
});

app.get('/board', function(req, res) {
	jira.findRapidView(function(response) {
		var view = rapid.getActive(rapid.getRapidsFromProject(response, config.project));
		res.json(view);
	});
});

app.get('/sprint/latest', function(req, res) {

	jira.findRapidView(function(response) {
		var view = rapid.getActive(rapid.getRapidsFromProject(response, config.project));

		console.log(view.id);

		jira.getSprint(view.id, function(e, r, body) {
			// getactive
			res.json(r);
		});
	});

});

app.get('/sprint/:rapidviewid', function(req, res) {
	jira.getSprint(req.params.rapidviewid, function(e, response) {
		res.json(response);
	});
});


// https://abcdevelop.jira.com/rest/greenhopper/1.0/rapidviewconfig/editmodel.json?rapidViewId=121
//  rest/greenhopper/1.0/xboard/work/allData/?rapidViewId=121

// jira.getLastSprintForRapidView(req.params.id, function(e, response, body) {
// 	res.json(response);
// });
// });
// app.get('/people/:nickname/issues', function(req, res) {
// 	getUserDetails(req, res, function(response) {
// 		res.json(response);
// 	});
// });

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});