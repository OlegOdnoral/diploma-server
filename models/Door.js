const mongoose = require('mongoose');

var Door = mongoose.model('Door', {
  place: {
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
  macAdress: {
    type: String,
    required: true,
    default: false,
    trim: true
  }/*,
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }*/
});

module.exports = {
  Door
};