const { string } = require('i/lib/util');
const mongoose = require('mongoose')
const allUser = require('./allUserModels')
const turfSchema = new mongoose.Schema({
    marchent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'allUser'
    },
    turfname: {
        type: String,
        required: [true, "Mandatory to pass turf name"],
        unique: true
    },
    photos: [],
    profile_image: {
        type: String
    },
    opening_time: {
        type: String,
        required: true
    },
    closing_time: {
        type: String,
        required: true
    },
    services: {
        type: Array,
    },
    rating: {
        type: Number,
    },
    coupon: {
        type: String,
    },
    playground: {
        type: String,
        name: String,
        default: '1'

    },
    playground_list: [{
        name: {
            type: String,
        }, price: {}
    }],
    email: {
        type: String,
        require: true
    },
    razorpay_key: {
        type: String
    },
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
        require: true,
        unique: true
    },
    available: {}
},{ timestamps: true });

module.exports = mongoose.model('Turf', turfSchema)
