const LocalStrategy = require("passport-local");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { fromAuthHeaderAsBearerToken } = require("passport-jwt/lib/extract_jwt");
const JwtStrategy = require("passport-jwt").Strategy;
require("dotenv").config();

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  const validPassword = (inputPassword, user) => {
    return bcrypt.compareSync(inputPassword, user.password);
  };
  try {
    const user = await User.findOne({ username });

    if (!user) return done(null, false);

    return validPassword(password, user) ? done(null, user) : done(null, false);
  } catch (error) {
    return done(error);
  }
});

exports.jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (jwt_payload, done) => {
    if (Date.now() > jwt_payload.exp) done(null, false);

    const user = await User.findById(jwt_payload._id).catch((e) =>
      done(e, false)
    );

    user ? done(null, user) : done(null, false);
  }
);
