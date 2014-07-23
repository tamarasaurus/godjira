'use strict';

var express = require('express');
var app = express();

var config = require('./config');
var Project = require('./lib/parser/project');
var project = new Project();
var Jira = require('jira-tamarasaurus').JiraApi;
var jira = new Jira('https', config.host, config.port, config.user, config.password, '2');


app.set('views', __dirname + '/views/');
app.set('view engine', 'jade');

// Set the project to be used

app.get('/project/:key', function(req, res) {
	jira.getProject(req.params.key, function(e, response, body) {
		console.log(project.set(response));
		res.render('project', {'project': JSON.stringify(project.set(response))});
		// res.json();
	});
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});