const jwt = require('jsonwebtoken');
const config = require('../config/env');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

module.exports = { generateToken };
