
const cloudinary = require("cloudinary").v2
const allUser = require("../Models/allUserModels")
const Turf = require("../Models/turfModels")
const USER = require("../Models/userModels")
const BOOKING = require("../Models/bookingModels")
const notification = require("../Middlewares/notification")
const jwt = require("../Middlewares/jwt")
const createSlots = require("../Middlewares/slots")

exports.nearestfindTurf = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const location = await USER.findOne({ user_id: req.token.id })
        let cordinat = location.location.coordinates
        if (latitude && longitude) {
            let data = await Turf.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [[latitude,
                            longitude], 5 / 3963.2]
                    }
                }
            }, { turfname: 1, location_name: 1, rating: 1 })
        } else if (location) {
            let data = await Turf.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [[cordinat[0],
                        cordinat[1]], 5 / 3963.2]
                    }
                }
            }, { turfname: 1, location_name: 1 })
            return res.json(
                {
                    data: { data }
                }
            )
        } else {
            return res.status(400).json({ message: "please select current location" })
        }
    }
    catch (err) {
        return res.status(500).json({ error: err })

    }

}

exports.getTurfDeatails = async (req, res) => {
    try {
        turfDeatails = await Turf.findOne({ _id: req.params.id }
            , {
                turfname: 1, location_name: 1, playground: 1, playground_list: 1, rating: 1, photos: 1,
                services: 1, available: 1
            })
        if (!turfDeatails) {
            return res.status(403).json({ message: "turf not found" })
        }
        return res.status(200).json(
            {
                message: "turf deatails",
                data: turfDeatails

            }
        )
    }
    catch (err) {
        return res.status(500).json({ error: err.message })

    }

}

exports.playgroundDeatails = async (req, res) => {
    try {
        const { currentDate, day } = req.body
        const desiredDate = new Date(currentDate);
        const turfDeatails = await Turf.findOne({ "playground_list": { $elemMatch: { "_id": req.params.id } } }
            , { "playground_list.$": 1, "available": 1 })
        let bookings = await BOOKING.find({ createdAt: { $gte: desiredDate } }, { st: 1, et: 1, _id: 0 })

        let playground = turfDeatails.playground_list[0].price[day]
        let timeTurf = turfDeatails.available[day]
        let slots = await createSlots.slots(timeTurf, bookings)

        if (!turfDeatails) {
            return res.status(403).json({ message: "turf not found" })
        }
        return res.status(200).json(
            {
                message: "turf deatails",
                price: playground, timeTurf, slots

            }
        )
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.message })

    }

}

exports.uploadProfile = async (req, res) => {
    try {
        let profile_images = 'notInserted';
        if (req.files) {

            let profile_image = req.files.profile_image
            profile_images = await cloudinary.uploader.upload(profile_image.tempFilePath, (err, result) => {
            })
            const profile = await Turf.findOneAndUpdate({ marchent_id: req.params.id }, { profile_image: profile_images.url })
            return res.status(201).json({ message: "image upload succefull" })
        }
        return res.staus(200).json({ success: false, message: "please upload image" })
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.imagesUpload = async (req, res) => {
    try {
        let profile_images = 'notInserted';
        if (req.files) {
            let profile_image = req.files.profile_image
            const turfImages = await Turf.findOne({ marchent_id: req.params.id }, { photos: 1 }) || []

            for (let data of profile_image) {
                profile_images = await cloudinary.uploader.upload(data.tempFilePath, (err, result) => {
                })
                turfImages.push(profile_images.url)
            }
            const profile = await Turf.findOneAndUpdate({ marchent_id: req.params.id }, { photos: turfImages })
            return res.status(201).json({ message: "image upload succefull" })
        }
        return res.staus(200).json({ success: false, message: "please upload image" })
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.showAllTurf = async (req, res) => {
    try {
        let allTurf = await Turf.find({ verify: true }, { turfname: 1, location_name: 1, rating: 1 })
        return res.status(200).json({ success: true, message: "turf get successful", turfList: allTurf })
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.TurDeatails = async (req, res) => {
    try {
        console.log(req.token)
        let user = await allUser.findById({ _id: req.token._id })
        let turfDeatails;
        if (user.role == "admin" || user.role == "merchant") {
            turfDeatails = await Turf.findOne({ _id: req.params.id })
            console.log(turfDeatails)
            user = await allUser.findById({ _id: turfDeatails.marchent_id })
        }
        if (!turfDeatails) {
            return res.status(403).json({ message: "turf not found" })
        }
        return res.status(200).json(
            {
                message: "turf deatails",
                data: turfDeatails, user

            }
        )
    }
    catch (err) {
        return res.status(500).json({ error: err.message })

    }

}

exports.verification = async (req, res) => {
    try {
        let turfRequest = await Turf.find({ verify: false }, { services: 1, turfname: 1, location_name: 1 }).populate('marchent_id', 'fullname mobile_number').exec()
        if (!turfRequest) {
            return res.status(403).json({ message: "turf request not found" })
        }
        return res.status(200).json(
            {
                message: "turf request",
                data: turfRequest

            }
        )
    }
    catch (err) {
        return res.status(500).json({ error: err.message })

    }

}

exports.verified = async (req, res) => {
    try {
        const { turf_id, flage } = req.body
        let turfRequest = await Turf.findOneAndUpdate({ _id: turf_id }, { $set: { verify: flage } })
        console.log(turfRequest)
        if (turfRequest.verify==true) {
            return res.status(403).json({ message: "turf unverified" })
        }else if(turfRequest.verify==false){
            return res.status(403).json({ message: "turf verified" })
        }
        return res.status(200).json(
            {
                message: "turf is not verify",

            }
        )
    }
    catch (err) {
        return res.status(500).json({ error: err.message })

    }

}
