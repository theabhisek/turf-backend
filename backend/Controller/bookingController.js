const allUser = require("../Models/allUserModels")
const Turf = require("../Models/turfModels")
const USER = require("../Models/userModels")
const BOOKING = require("../Models/bookingModels")

exports.showBookings = async (req,res)=>{
    try{
        let listOfBooking = await BOOKING.findOne(req.params.id)
        return res.status(200).json({list:listOfBooking})
    }
    catch(err){
        return res.status(500).json({err:err})
    }
}