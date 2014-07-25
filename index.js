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


// Page routes

// Get issues for a person
app.get('/people/:nickname', function(req, res) {
	user.getDetails(req, res, function(response) {
		console.log(response);
		res.render('person', {
			'resource': response
		});
	}, config, jira);
});

// API routes

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
app.get('/api/sprint/latest', function(req, res) {
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