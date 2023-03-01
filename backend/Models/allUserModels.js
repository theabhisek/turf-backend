const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Mandatory to Enter Name"]
    },
    mobile_number: {
        type: Number,
        required: [true, "Please Enter mobile number"],
        unique: true
    },
    role: {
        type: String,
        enum: ["admin", "merchant", "user"],
        default: "user"
    },
    user_status: {
        type: String,
        enum: ['blocked', 'unblocked', ""],
        default: 'unblocked'
    },
},{timestamps:true});

module.exports = mongoose.model('allUser', userSchema)
