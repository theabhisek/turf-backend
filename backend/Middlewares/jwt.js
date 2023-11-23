let jwt = require("jsonwebtoken");
const crypto = require('crypto')

exports.signUser = async function(user) {
    const payload = {
        _id: user._id,
        mobile_number: user.mobile_number,
        fullname: user.fullname,
        role: user.role
    }
    console.log(process.env.JWT_SECRET_KEY)
    try {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY);
    } catch (err) {}
};

exports.verify = async function(req, res, secret = null) {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token || token === "") {
        return false;
    } else if (token.startsWith("Bearer ")) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
        try {
            let info = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return info;
        } catch (err) {
            return false;
        }
    }
};

exports.decode = async function(token) {
    return jwt.decode(token, {
        complete: true
    });
};