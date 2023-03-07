let jwt = require("jsonwebtoken");
const crypto=require('crypto')

exports.signUser = async function (user,result) {
    const payload = {
        _id :user._id,
        mobile_number:user.mobile_number,
        firstname:user.firstname,
        lastname:user.lastname,
        location:result.location,
        location_name:result.location_name,
        role:user.role,
        profile_image:user.profile_image 
    }
    console.log(process.env.JWT_SECRET_KEY)
  try {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY,{expiresIn: '1d'});
  } catch (err) {}
};
exports.signTurf= async function (user,result) {
  const payload = {
      _id :user._id,
      mobile_number:user.mobile_number,
      firstname:user.fullname,
      location:result.location,
      location_name:result.location_name,
      role:user.role,
      profile_image:user.profile_image,
      turfname:result.turfname,
      marchent_id:result.marchent_id
  }
try {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY)
} catch (err) {
  return err
}
};

exports.verify = function (req, res, secret = null) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token || token === "") {
    return null;
  } else if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
    try {
      let info = jwt.verify(token,process.env.JWT_SECRET_KEY);
      return info;
    } catch (err) {
      return null;
    }
  }
};

exports.decode = function (token) {
  return jwt.decode(token, { complete: true });
};

