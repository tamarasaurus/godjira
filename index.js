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
	Sprint = require('./lib/parser/sprint'),
	Issues = require('./lib/parser/issues');

var user = new User(),
	project = new Project(),
	rapid = new Rapid(),
	sprint = new Sprint(),
	issues = new Issues();


// Jira api
var Jira = require('jira-tamarasaurus').JiraApi,
	jira = new Jira('https', config.host, config.port, config.user, config.password, '2');

// App settings
app.set('views', __dirname + '/views/');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));


// Page routes

// Get issues for a person
app.get('/people/:nickname', function(req, res) {
	user.getDetails(req, res, function(response) {
		console.log(response);
		res.render('person', {
			'resource': response,
			'issues': issues.orderByStatus(response.issues),
			'title': 'Issues for ' + req.params.nickname
		});
	}, config, jira);
});


app.get('/sprints/latest', function(req, res) {
	jira.findRapidView(function(response) {
		var view = rapid.getActive(rapid.getRapidsFromProject(response, config.project));
		jira.getSprint(view.id, function(e, r, body) {
			// order by person?
			// split up issues by person - categorise
			res.render('sprint', {
				'resource': r,
				'group': issues.groupByPerson(issues.orderByStatus(sprint.normaliseIssues(r.issuesData.issues))),
				'title': 'Issues for the latest sprint',
				'host': config.host
			});
			// res.json(issues.groupByPerson(issues.orderByStatus(sprint.normaliseIssues(r.issuesData.issues))));
		});
	});
});


// API routes

// put routes in a separate file
// make another file to parse route params

app.get('/api/project/:key', function(req, res) {
	jira.getProject(req.params.key, function(e, response, body) {
		res.render('project', {
			'project': JSON.stringify(project.set(response))
		});
	});
});

// Get data for user issues
app.get('/api/people/:nickname', function(req, res) {
	user.getDetails(req, res, function(response) {
		res.json(response);
	}, config, jira);
});

// Get data for the latest active board from the configured project
app.get('/api/board', function(req, res) {
	jira.findRapidView(function(response) {
		var view = rapid.getActive(rapid.getRapidsFromProject(response, config.project));
		res.json(view);
	});
});

// Get the latest sprint from the latest active rapidview board
app.get('/api/sprints/latest', function(req, res) {
	jira.findRapidView(function(response) {
		var view = rapid.getActive(rapid.getRapidsFromProject(response, config.project));
		jira.getSprint(view.id, function(e, r, body) {
			res.json(r);
		});
	});
});


var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});