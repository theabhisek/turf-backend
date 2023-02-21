const mongoose=require('mongoose')
// const User=require('./allUserModels')
// const Turf=require('./turfModels')


const bookingSchema= new mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'allUser'},
    turf_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'Turf'},
    createdat:{type:Date,default:Date.now()},
    playground_id:{type:mongoose.Schema.Types.ObjectId,ref:'Turf'},
    booking_price:{type:Number,ref:"Turf"},
    booking_status:{type:Boolean,required:[true,"confimed booking"]},
    payment_id:{type:String},
    st:{type:Date},
    et:{type:Date}

},{timestamps:true});
module.exports = mongoose.model('Booking', bookingSchema)