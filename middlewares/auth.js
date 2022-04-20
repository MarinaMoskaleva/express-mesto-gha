const jwt = require('jsonwebtoken');
const { ERROR_CODE_BAD_LOGIN_OR_PASS, SEKRET_KEY } = require('../constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(ERROR_CODE_BAD_LOGIN_OR_PASS)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, SEKRET_KEY);
  } catch (err) {
    return res
      .status(ERROR_CODE_BAD_LOGIN_OR_PASS)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  return next();
};
