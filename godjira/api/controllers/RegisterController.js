var passport = require("passport");
module.exports = {
  show: function(req, res) {
    res.view("auth/register");
  },

  _config: {}
};