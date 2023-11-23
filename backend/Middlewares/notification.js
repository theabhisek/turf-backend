const otpGenerator = require("otp-generator")
const allUser = require("../Models/allUserModels")
const Turf = require("../Models/turfModels")
const Otp = require("../Models/otpModels")
const bcrypt = require("bcrypt")
const _ = require("lodash")

exports.otpsend = async function(mobile_number) {
    try {
        const otpNew = otpGenerator.generate(4, {
            digits: true,
            alphabets: false,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        const otp = new Otp({
            mobile_number: mobile_number,
            otp: otpNew
        })
        const salt = await bcrypt.genSalt(10)
        otp.otp = await bcrypt.hash(otp.otp, salt)
        await otp.save()
        return {
            value: true,
            otp: otpNew
        }
    } catch (err) {
        return false
    }
}

exports.verifyOtp = async function(mobile_number, otp) {
    try {
        const otpHolder = await Otp.find({
            mobile_number: mobile_number
        })
        if (otpHolder.length === 0)
            return {
                message: "please resend otp"
            }

        const rightFind = otpHolder[otpHolder.length - 1];
        const validUser =  bcrypt.compare(otp, rightFind.otp)
        if (rightFind.mobile_number == mobile_number && validUser) {
            await Otp.deleteMany({
                mobile_number: rightFind.mobile_number
            })
            return true
        }
        return {
            message: "Otp was wrong"
        }
    } catch (err) {
        return err
    }
}
