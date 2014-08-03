var bcrypt = require('bcrypt');
module.exports = {
	attributes: {
		username: {
			type: 'string',
			required: true,
			unique: true
		},
		password: {
			type: 'string',
			required: true
		},
		nickname: {
			type: 'string',
			required: true
		},
		project_name: {
			type: 'string'
		},
		project_key: {
			type: 'string'
		},

		//Override toJSON method to remove password from API
		toJSON: function() {
			var obj = this.toObject();
			// Remove the password object value
			delete obj.password;
			// return the new object without password
			return obj;
		}
	},

	beforeUpdate: function(user, cb) {
		console.log('before update');
		cb();
	},

	beforeCreate: function(user, cb) {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) {
					console.log(err);
					cb(err);
				} else {
					user.password = hash;
					cb(null, user);
				}
			});
		});
	}
};