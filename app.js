const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const validator = require('validator');
const { ERROR_CODE_INTERNAL, AVATAR_REGEX } = require('./constants');
const auth = require('./middlewares/auth');
const {
  createUser, login,
} = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) throw err;
});

app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
    avatar: Joi.string().custom((value, helpers) => {
      if (AVATAR_REGEX.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
  }),
}), createUser);

// app.use(auth);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('/', (req, res, next) => {
  next(new NotFoundError('Неправильный путь.'));
});

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = ERROR_CODE_INTERNAL, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_CODE_INTERNAL
        ? 'Ошибка по умолчанию.'
        : message,
    });
  next();
});

app.listen(PORT);
