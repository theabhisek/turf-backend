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
        required: true,
    },
    booking_status: {
        type: String,
        enum: ['created', 'paid', 'refunded', 'failed'],
        default: 'created',
    },
    payment_id: {
        type: String,
        required: true,
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
