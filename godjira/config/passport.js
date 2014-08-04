//http://jethrokuan.github.io/2013/12/19/Using-Passport-With-Sails-JS.html
//https://bitbucket.org/knecht_andreas/passport-atlassian-oauth

/* global User */

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	bcrypt = require('bcrypt'),
	Jira = require('godjira-wrapper');

passport.serializeUser(function(user, done) {
	done(null, user[0].id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findByUsername(username).done(function(err, user) {
			if (err) {
				return done(null, err);
			}
			if (!user || user.length < 1) {
				return done(null, false, {
					message: 'Incorrect User'
				});
			}
			bcrypt.compare(password, user[0].password, function(err, res) {
				if (!res) return done(null, false, {
					message: 'Invalid Password'
				});
				return done(null, user);
			});
		});
	}));

module.exports = {
	express: {
		customMiddleware: function(app) {

			app.use(passport.initialize());
			app.use(passport.session());
			app.use(function(req, res, next) {

        // it only gets that data when you log in
        // console.log(req.body);

				if (typeof req.user !== 'undefined') {



					var jira = new Jira({
						user: req.user[0].username,
						pass: req.body.password,
						host: req.user[0].jira_host,
						project: {
							key: req.user[0].project_key,
							name: req.user[0].project_name
						}
					});

          console.log({
            user: req.user[0].username,
            pass: req.body.password,
            host: req.user[0].jira_host,
            project: {
              key: req.user[0].project_key,
              name: req.user[0].project_name
            }
          });

					res.locals.jira = jira;
				}
				next();
			});
		}
	}
};