const allUser = require("../Models/allUserModels")
const Turf = require("../Models/turfModels")
const USER = require("../Models/userModels")
const BOOKING = require("../Models/bookingModels")
const notification = require("../Middlewares/notification")
const jwt = require("../Middlewares/jwt")

exports.veryfiyUser = async function (req, res) {
    try {
        const { firstname,lastname,mobile_number, location,location_name,otp,role } = req.body;
        const otpIsTrue = await notification.verifyOtp(mobile_number, otp)
        console.log(otpIsTrue)

        if (otpIsTrue == true) {
            const user=await allUser.create({firstname,lastname,mobile_number,role})
            let user_id=user._id
            const result = await USER.create({user_id,location,location_name})
            const token = await jwt.signUser(user,result);
            return res.status(201).cookie("token", token)
                    .json({success: true,message: "User register successfully",user,result,token,})
        }
        return res.status(400).json({ message: otpIsTrue.message })
    }
    catch (err) {
        return res.status(400).json({ Error: err })
    }
}

exports.veryfiyTurf = async function (req, res) {
    try {
        const { turfname, opening_time, closing_time, location,location_name, 
            playground, playground_list, services, account_details, mobile_number, firstname, lastname ,otp} = req.body; 
            const otpIsTrue = await notification.verifyOtp(mobile_number, otp)

        if (otpIsTrue == true) {
                const role ="marchent"
                const user = new allUser({mobile_number, firstname, lastname,role})
                const result = await user.save()
                const marchent_id=user._id
                const turfUser = new Turf({turfname,marchent_id,opening_time,closing_time,location,location_name,playground
                ,playground_list,services,account_details})
                const userResult = await turfUser.save()
                const token = await jwt.signTurf(user,userResult);
                return res.status(201).cookie("token", token)
                    .json({
                        success: true,
                        message: "User register successfully",
                        result,
                        token,
                    })
        }
        return res.status(400).json({ message: otpIsTrue.message })
    }
    catch (err) {
        console.log("ghj")
        return res.status(400).json({ Error: err })
    }
}

exports.login = async function (req, res) {
    try {
        const { mobile_number } = req.body;
        let user = await allUser.findOne({ mobile_number });
        if (user) {
            let msg = await notification.otpsend(mobile_number)
            return res.status(200).json({ "message": "otp sent successfully !", otp: msg.otp })
        }
        else {
            return res.status(200).json({ message: "you are not register" })
        }
    }
    catch (err) {
        return res.status(400).json({ Error: err })
    }
}
exports.createOtp = async function (req, res) {
    try {
        const { mobile_number } = req.body;
        let user = await allUser.findOne({ mobile_number });
        if (user) {
            return res.status(200).json({ "message": " you are already register !", otp: msg.otp })
        }
        else {
            let msg = await notification.otpsend(mobile_number)
            if(msg)
            return res.status(200).json({ message: "otp sent successfully !" })
        }
    }
    catch (err) {
        return res.status(400).json({ Error: err })
    }
}

exports.loggedIn = async function (req, res) {
    try {
        const { mobile_number, otp } = req.body;
        const otpIsTrue = await notification.verifyOtp(mobile_number, otp)

        if (otpIsTrue == true) {
            let user = await allUser.findOne({ mobile_number });
            let token;
            if(user.role=="marchent"){
                let marchent_id=user._id
                const result = await Turf.findOne({marchent_id})
                token = await jwt.signTurf(user,result);
                console.log(result,user)
            }
            else{
                let user_id=user._id
                const result = await USER.findOne({user_id})
                token = await jwt.signUser(user,result);
            }
            return res.status(201).cookie("token", token)
                    .json({success: true,message: "you logged in successfully",user,token,})
        }
        else {
            return res.status(200).json({ message: otpIsTrue.message })
        }
    }
    catch (err) {
        return res.status(400).json({ Error: err })
    }
}

// update profiles
exports.updateUserProfile=async(req,res)=>{
    try{
        const {mobile_number}=req.body
    const data= await allUser.findOne({mobile_number})
    if(!data) { 
        const user_id=req.params.id
    const user= await allUser.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
    const result= await USER.findOneAndUpdate(user_id,{$set:req.body},{new:true})
    return res.status(200).json({success:true,user,result})
    }else{
        return res.status(201).json({message:"cannot change your mobile number "})
    }
}
catch(error){
    return res.status(500).json({success:false,message:error.message})
}
}
