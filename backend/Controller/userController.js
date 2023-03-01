const allUser = require("../Models/allUserModels")
const Turf = require("../Models/turfModels")
const USER = require("../Models/userModels")
const BOOKING = require("../Models/bookingModels")
const notification = require("../Middlewares/notification")
const jwt = require("../Middlewares/jwt")

exports.createOtp = async function (req, res) {
    try {
        const { mobile_number } = req.body;
            let msg = await notification.otpsend(mobile_number)
            if (msg)
                return res.status(200).json({ message: "otp sent successfully !" })
        }
    
    catch (err) {
        return res.status(400).json({ Error: err })
    }
}

exports.veryfiyUser = async function (req, res) {
    try {
        const { turfname, opening_time, closing_time,latitude,longitude, location_name,
            playground, playground_list, services, mobile_number, fullname,role,available} = req.body;
        let dataUSer = await allUser.findOne({ mobile_number });
        if(!dataUSer){
        const location={
                "type":"Point",
                "coordinates":[latitude,longitude]
            }        
            const user = await allUser.create({ fullname,mobile_number, role })
            if (role == "merchant") {
                const marchent_id = user._id
                const turfUser = await Turf.create({
                    turfname, marchent_id, opening_time, closing_time, location, location_name, playground
                    , playground_list, services,available
                })
                const token = await jwt.signTurf(user, turfUser);
                return res.status(201).cookie("token", token)
                    .json({
                        success: true,
                        message: "turf register successfully",
                        turfUser,
                        token,
                    })
                }
            let user_id = user._id
            const result = await USER.create({ user_id, location, location_name })
            const token = await jwt.signUser(user, result);
            return res.status(201).cookie("token", token)
                .json({ success: true, message: "User register successfully", user, result, token})
    }
    return res.status(200).json({message:"user is already register"})}
    catch (err) {
        return res.status(400).json({ Error: err.message })
    }
}

exports.loggedIn = async function (req, res) {
    try {
        const { mobile_number, otp } = req.body;
        const otpIsTrue = await notification.verifyOtp(mobile_number, otp)

        if (otpIsTrue == true) {
            let user = await allUser.findOne({ mobile_number });
            if(user){
                let token;
                console.log(user)
                if (user.role == "merchant") {
                let marchent_id = user._id
                const result = await Turf.findOne({ marchent_id })
                token = await jwt.signTurf(user, result);
                console.log(result, user)
            }
            else {
                let user_id = user._id
                const result = await USER.findOne({ user_id })
                token = await jwt.signUser(user, result);
            }
            return res.status(201).cookie("token", token)
                .json({ success: true, message: "you logged in successfully", user, token})
        }else{
            return res.status(201).json({success:false,message:"user are not register"})
        }
    }
        else {
            return res.status(200).json({ message: otpIsTrue.message })
        }
    }
    catch (err) {
        return res.status(400).json({ Error: err.message })
    }
}

// update profiles
exports.updateUserProfile = async (req, res) => {
    try {
        const { mobile_number } = req.body
        const data = await allUser.findOne({ mobile_number })
        if (!data) {
            const user_id = req.params.id
            const user = await allUser.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            const result = await USER.findOneAndUpdate(user_id, { $set: req.body }, { new: true })
            return res.status(200).json({ success: true, user, result })
        } else {
            return res.status(201).json({ message: "cannot change your mobile number " })
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await allUser.findById(req.token.id)
        const userDetails = await USER.findOne({ user_id: user._id })
        if (!user) {
            return res.status(403).json({ message: "user not found" })
        }
        return res.json(
            {
                data: { user, userDetails }
            }
        )
    }
    catch (err) {
        return res.status(500).json({ error: err })

    }

}

exports.getAllUser = async (req, res) => {
    try {
        const user = await allUser.find({ role: "user" })
        if (!user) {
            return res.status(403).json({ message: "user not found" })
        }
        return res.json(
            {
                data: userDetails
            }
        )
    }
    catch (err) {
        return res.status(500).json({ error: err })

    }

}
