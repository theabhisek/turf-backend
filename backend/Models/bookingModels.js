const mongoose = require('mongoose')
// const User=require('./allUserModels')
// const Turf=require('./turfModels')


const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'allUser'
    },
    turf_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Turf'
    },
    playground_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Turf'
    },
    booking_price: {
        type: String,
        required: true
    },
    payment_mode: {
        type: String,
        required: true
    },
    payment_id: {
        type: String
    },
    booking_date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);