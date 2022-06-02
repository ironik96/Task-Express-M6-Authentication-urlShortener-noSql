const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signin = async (req, res) => {
  try {
    const token = generateToken(req.user);
    res.status(201).json(token);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.signup = async (req, res) => {
  const saltRounds = 10;
  try {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json(token);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

const generateToken = (user) => {
  const numOfMin = +process.env.JWT_EXP;
  const payload = {
    _id: user._id,
    username: user.username,
    // JWT_EXP is in min
    exp: Date.now() + numOfMin * 60 * 1000,
  };

  // token
  return jwt.sign(payload, process.env.JWT_SECRET);
};
