const {
    validateNumber,
    validateNumberOtp,
    validationSingUp,
    validationUpdateUser,
    validationRazorpayAccount
} = require("../Controller/utils/validation");

exports.mobileValidation = async (req, res, next) => {
    try {
        const {
            error,
            value
        } = validateNumber(req.query)
        if (error)
            return res.status(400).json({
                message: error.details
            })
        next()
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.mobileOtpValidation = async (req, res, next) => {
    try {
        const {
            error,
            value
        } = validateNumberOtp(req.body)
        if (error)
            return res.status(400).json({
                message: error.details
            })
        next()
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.singUpValidation = async (req, res, next) => {
    try {
        const {
            error,
            value
        } = validationSingUp(req.body)
        if (error)
            return res.status(400).json({
                error: error.details
            })
        next()
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}


exports.updateUserValidation = async (req, res, next) => {
    try {
        const {
            error,
            value
        } = validationUpdateUser(req.body)
        if (error)
            return res.status(400).json({
                message: error.details
            })
        next()
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.validateMerchantAccount = async (req, res, next) => {
    try {
        const {
            error,
            value
        } = validationRazorpayAccount(req.body)
        if (error)
            return res.status(400).json({
                error: error.details
            })
        next()
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}