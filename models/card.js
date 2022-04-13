const mongoose = require('mongoose');
const userScheme = require('./user');

// const { ObjectId } = mongoose.Types.ObjectId;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: userScheme,
    required: true,
  },
  likes: [
    {
      type: userScheme,
      default: [],
    }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
