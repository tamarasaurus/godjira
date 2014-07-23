var config = require('config');
var Jira = require('jira-tamarasaurus').JiraApi;
var jira = new Jira('https', config.host, config.port, config.user, config.password, '2.0.alpha1');


console.log(jira);
