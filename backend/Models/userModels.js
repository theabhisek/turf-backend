const mongoose = require('mongoose');

const user = new mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId,required:true,ref:'allUser'},
    favourite:[],
    booking: [],
    name: String,
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
,
    location_name:{
        type:String,
    }
});

module.exports = mongoose.model('User', user)