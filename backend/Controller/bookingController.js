const allUser = require("../Models/allUserModels")
const Turf = require("../Models/turfModels")
const USER = require("../Models/userModels")
const BOOKING = require("../Models/bookingModels")
const createSlots = require("../Middlewares/slots")

exports.showBookings = async (req,res)=>{
    try{
        const desiredDate = new Date('2023-02-27');
        let data=await BOOKING.find({ createdAt: { $gte: desiredDate }},{st:1,et:1,_id:0} )
        let slots = await createSlots.slots()
        return res.status(200).json({data,slots})
    }
    catch(err){
        return res.status(500).json({err:err})
    }
}

exports.creteBooking= async(req,res)=>{
    try{
        const {user_id,turf_id,playground_id,booking_price,payment_id,booking_status,st,et} = req.body;
        console.log(req.body)
        const result = await BOOKING.create({user_id,turf_id,playground_id,booking_price,payment_id,booking_status,st,et})
        return res.status(200).json({messsage:result})
        
    }
    catch(err){
        return res.status(500).json({err:err.messsage})
    }
}
exports.showMyBooking = async( req,res)=>{
    try{
        const result = await BOOKING.findOne({user_id:req.token.id})
        return res.status(200).json({messsage:result})
        
    }
    catch(err){
        return res.status(500).json({err:err.messsage})
    }
}