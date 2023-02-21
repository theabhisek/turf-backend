const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
// const bcrypt=require('bcrypt');
// const crypto=require('crypto')


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Mandatory to Enter First Name"]
    },
    lastname: {
        type: String,
        required: [true, "Mandatory to Enter last name"]
    },
    mobile_number: {
        type: Number,
        required: [true, "Please Enter mobile number"]
    },
    role: {
        type: String,
        enum: ["admin", "marchent", "user"],
        default: "user"
    },
    profile_image: {
        type: String,
        default: null
    },
    user_status: {
        type: String,
        enum: ['blocked', 'unblocked', ""],
        default: 'unblocked'
    },
},{timestamps:true});

module.exports = mongoose.model('allUser', userSchema)