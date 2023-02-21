const mongoose = require('mongoose')

const otp = new mongoose.Schema({
    mobile_number: {
        type: Number,
    }, 
    email: {
        type: String,
    },
    otp: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date, default: Date.now, index: { expires: 300 }
    }

}, { timestamps: true });



module.exports = mongoose.model('otp', otp)