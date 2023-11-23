const allUser = require('../Models/allUserModels')
const Turf = require("../Models/turfModels")
const jwt = require('./jwt')

exports.isAuthenticated = async (req, res, next) => {
    try {
        const decoded = await jwt.verify(req, res);
        if (!decoded || decoded == "false") {
            console.log(decoded)
            return res.status(498).json({
                message: "Please login first"
            });

        }
        req.token = await allUser.findById(decoded._id)
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message

        })
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        const decoded = await jwt.verify(req, res);
        if (!decoded) {
            return res.status(498).json({
                message: "Please login first"
            });
        }
        req.token = await allUser.findById(decoded._id)
        console.log(req.token)
        if (req?.token?.role == "admin") {
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "You are unauthrized to access this route."

            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message

        })
    }
}

exports.isMerchant = async (req, res, next) => {
    try {
        const decoded = await jwt.verify(req, res);
        if (!decoded) {
            return res.status(498).json({
                message: "Please login first."
            });

        }
        req.token = await allUser.findById(decoded._id)
        if (req.token.role == "merchant") {
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "You are unauthrized to access this route."

            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message

        })
    }
}

exports.isVerify = async (req, res, next) => {
    try {
        let {
            mobile_number
        } = req.query;
        let data = await allUser.findOne({
            mobile_number
        })
        if (data?.user_status == "blocked") {
            return res.status(409).json({
                success: true,
                message: "you are block contact our support team"
            })
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message

        })
    }
}