const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ERROR_CODE_INTERNAL } = require('./constants');
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
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});

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
