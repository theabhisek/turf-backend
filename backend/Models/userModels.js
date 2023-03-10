const mongoose = require('mongoose');

const user = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'allUser'
  },
  favourite: [],
  booking: [],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  location_name: {
    type: String,
  }
},{ timestamps: true });

module.exports = mongoose.model('User', user)
