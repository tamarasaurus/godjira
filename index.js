'use strict';

var _ = require('underscore');
var config = require('./config');

var express = require('express');
var app = express();

// Parsers
var Project = require('./lib/parser/project');
var User = require('./lib/parser/user');

var Jira = require('jira-tamarasaurus').JiraApi;
var jira = new Jira('https', config.host, config.port, config.user, config.password, '2');


var user = new User();
var project = new Project();


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

// order options: created/updated/priority

var getUserParams = function(req, open) {
	var username = user.getUsername(req.params.nickname, config.friends);
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

var getUserDetails = function(req, res, callback, open) {
	var params = getUserParams(req, res, open);
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

app.get('/rapid', function(req, res) {
	jira.findRapidView('OPEN', function(e, response){
		res.json(response);
	});
});

app.get('/sprint/:rapidviewid', function(req, res) {
	jira.getSprint(req.params.rapidviewid, function(e, response){
		res.json(response);
	});
});


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