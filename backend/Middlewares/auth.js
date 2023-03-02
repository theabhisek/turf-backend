const allUser = require('../Models/allUserModels')
const jwt = require('./jwt')

exports.isAuthenticated = async (req, res, next) => {
    try {
        const decoded = await jwt.verify(req, res);
        if (!decoded) {
            return res.status(401).json({
                message: "Please login first"
            });

        }
        req.token = await allUser.findById(decoded._id)
        next();
    }
    catch (error) {
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
            res.status(401).json({
                message: "Please login first"
            });

        }
        req.token = await allUser.findById(decoded._id)
        if (req.token.role == "admin") {
            next();
        }
        else {
            res.status(500).json({
                success: false,
                message: "you are unauthrized to access this route"

            })
        }
    }
    catch (error) {
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
            res.status(401).json({
                message: "Please login first"
            });

        }
        req.token = await allUser.findById(decoded._id)
        if (req.token.role == "merchant") {
            next();
        }
        else {
            res.status(500).json({
                success: false,
                message: "you are unauthrized to access this route"

            })
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message

        })
    }
}