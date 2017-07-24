const mongoose = require('mongoose');

var User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  accessLevel: {
    type: Number,
    required: true,
    minlength: 1,
    trim: true
  },
  cardUuid: {
    type: String,
    required: true
  },
  /*,
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }*/
});

module.exports = {
  User
};