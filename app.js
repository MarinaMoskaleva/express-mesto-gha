const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {ERROR_CODE_NOT_FOUND} = require('./constants');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  if(err) throw err;
}
);
app.use((req, res, next) => {
  req.user = {
    _id: '625488ccf0acc0a2e160b5ed'
  };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use(function(req, res){
  res.status(ERROR_CODE_NOT_FOUND).send({ message: "Неправильный путь" });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
