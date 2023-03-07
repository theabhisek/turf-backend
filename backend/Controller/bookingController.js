const allUser = require("../Models/allUserModels")
const Turf = require("../Models/turfModels")
const USER = require("../Models/userModels")
const mongoose = require('mongoose')
const BOOKING = require("../Models/bookingModels")
const createSlots = require("../Middlewares/slots")
//admin
exports.showAllBookings = async (req, res) => {
    try {
        const { currentDate } = req.query;
        if (currentDate) {
            const desiredDate = new Date(currentDate);
            let data = await BOOKING.find({ createdAt: { $gte: desiredDate } })
            return res.status(200).json({ data: data })
        } else {
            let data = await BOOKING.find({})
            return res.status(200).json({ data: data })
        }
    }
    catch (err) {
        return res.status(500).json({ err: err.messsage })
    }
}

exports.bookingDetails = async (req, res) => {
    try {
        console.log(req.params)
        let data = await BOOKING.find({ _id: req.params.id })
        if (data) {
            return res.status(200).json({ data: data })
        }
        return res.status(200).json({ messsage: "not found details" })
    }
    catch (err) {
        return res.status(500).json({ err: err.messsage })
    }
}

exports.turfAllBooking = async (req, res) => {
    try {
        const { currentDate } = req.query;
        console.log(req.query)
        if (currentDate) {
            const desiredDate = new Date(currentDate);
            let data = await BOOKING.find({ turf_id: req.query.turf_id, createdAt: { $gte: desiredDate } })
            return res.status(200).json({ data, data })
        } else {
            let data = await BOOKING.find({ turf_id: req.query.turf_id })
            console.log(data)
            return res.status(200).json({ data: data })
        }
    }
    catch (err) {
        return res.status(500).json({ err: err.messsage })
    }
}

exports.singleBookingDetails = async (req, res) => {
    try {
        let data = await BOOKING.findOne({ _id: req.params.id })
        if (data) {
            return res.status(200).json({ data: data })
        }
        return res.status(200).json({ messsage: "not found details" })
    }
    catch (err) {
        return res.status(500).json({ err: err.messsage })
    }
}

exports.allCollectionOfTurfs = async (req, res) => {
    try {
        const { currentDate } = req.query;
        let user;
        if(currentDate) {
            const date = new Date(currentDate);
            console.log("fghjk")
             user = await BOOKING.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                            $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total_price: { $sum: '$booking_price' }
                    }
                }
            ])
            console.log("fghjk",user)
        }
        else{
            user = await BOOKING.aggregate([
               {
                   $group: {
                       _id: null,
                       total_price: { $sum: "$booking_price" }
                   }
               }
           ])
       } 

        return res.json(
            {
                total_price: user[0].total_price
            }
        )
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.allCollectionOfTurf = async (req, res) => {
    try {
        const { currentDate,turf_id } = req.query;
        let user;
        console.log(turf_id)
        if(currentDate && turf_id) {
            console.log("hjkl")
            const date = new Date(currentDate);
             user = await BOOKING.aggregate([
                {
                    $match: {
                        turf_id: mongoose.Types.ObjectId(turf_id),
                        createdAt: {
                            $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                            $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: "$turf_id",
                        total_price: { $sum: '$booking_price' }
                    }
                }
            ])
            console.log(user)
    }
        else{
            user = await BOOKING.aggregate([ {$match:{turf_id:mongoose.Types.ObjectId(turf_id)}} ,      
               {
                   $group: {
                       _id: "$turf_Id",
                       total_price: { $sum: "$booking_price" }
                   }
               }
           ])
       } 
if(user.length)
        return res.json(
            {
                total_price: user[0].total_price
            }
        )
        return res.status(400).json({message:"booking not hare"})
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

//user
exports.creteBooking = async (req, res) => {
    try {
        const { user_id, turf_id, playground_id, booking_price, payment_id, booking_status, st, et } = req.body;
        console.log(req.body)
        const result = await BOOKING.create({ user_id, turf_id, playground_id, booking_price, payment_id, booking_status, st, et })
        return res.status(200).json({ messsage: result })

    }
    catch (err) {
        return res.status(500).json({ err: err.messsage })
    }
}

exports.showMyBooking = async (req, res) => {
    try {
        const { currentDate } = req.query;
        let result;
        if (currentDate) {
            const desiredDate = new Date(currentDate);
            const tomorrowDate = new Date(currentDate);
            tomorrowDate.setDate(desiredDate.getDate() + 1);

            console.log(desiredDate, tomorrowDate)
            result = await BOOKING.find({
                user_id: req.token.id, createdAt: {
                    $gte: currentDate,
                    $lt: tomorrowDate
                }
            })
        } else {
            result = await BOOKING.find({ user_id: req.token.id })
        }
        return res.status(200).json({ messsage: result })
    }
    catch (err) {
        return res.status(500).json({ err: err.messsage })
    }
}