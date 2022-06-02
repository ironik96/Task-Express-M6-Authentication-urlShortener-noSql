const LocalStrategy = require("passport-local");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const localStrategy = new LocalStrategy(async (username, password, done) => {
  console.log("in local strategy");
  try {
    const user = await User.findOne({ username });

    if (!user) return done(null, false);

    return validPassword(password, user) ? done(null, user) : done(null, false);
  } catch (error) {
    return done(error);
  }
});

const validPassword = (inputPassword, user) => {
  return bcrypt.compareSync(inputPassword, user.password);
};

module.exports = localStrategy;
