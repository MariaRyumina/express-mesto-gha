const jwt = require('jsonwebtoken');
const httpCode = require('../httpCode');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(httpCode.ERROR_UNAUTHORIZED).send({ message: 'Требуется авторизация' });
    return;
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', ''); // Таким образом, в переменную token запишется только JWT
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    res.status(httpCode.ERROR_UNAUTHORIZED).send({ message: 'Требуется авторизация' });
  }

  req.user = payload;

  next();
};
