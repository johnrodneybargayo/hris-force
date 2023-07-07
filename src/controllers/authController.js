const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require('../helpers/auth'); // Import the auth module

// Check if email exists
module.exports.emailExists = (params) => {
  return User.find({ email: params.email }).then((resultFromFind) => {
    return resultFromFind.length > 0;
  });
};

// User login
module.exports.login = (params) => {
  const { email, password } = params;

  return User.findOne({ email: email }).then((user) => {
    if (!user) {
      return { error: 'user-not-found' };
    }

    if (user.loginType !== 'email') {
      return { error: 'login-type-error' };
    }

    const isPasswordMatched = bcrypt.compareSync(password, user.password);

    if (isPasswordMatched) {
      return { access: auth.createAccessToken(user.toObject()) };
    } else {
      return { error: 'incorrect-password' };
    }
  });
};
