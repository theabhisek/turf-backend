const allUser = require("../Models/allUserModels");
const Turf = require("../Models/turfModels");
const USER = require("../Models/userModels");
const BOOKING =require("../Models/bookingModels");
const notification = require("../Middlewares/notification");
const jwt = require("../Middlewares/jwt");
const base64 = require("base-64");

exports.sendOtp = async function (req, res) {
  try {
    let { mobile_number } = req.query;
    mobile_number = Number(mobile_number);
    if (mobile_number) {
      let msg = await notification.otpsend(mobile_number);
      if (msg) {
        return res.status(200).json({
          success: true,
          message: "OTP was sent successfully!",
          otp: msg.otp,
        });
      }
    }
    return res.status(400).json({
      success: false,
      message: "Please enter your mobile number.",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.veryfiyUser = async function (req, res) {
  try {
    const {
      mobile_number,
      fullname,
      role,
      latitude,
      longitude,
      location_name,
    } = req.body;
    let dataUSer = await allUser.findOne({
      mobile_number,
    });
    if (!dataUSer) {
      const location = {
        type: "Point",
        coordinates: [latitude, longitude],
      };
      const user = await allUser.create({
        fullname,
        mobile_number,
        role,
      });
      if (user.role == "user") {
        let user_id = user._id;
        await USER.create({
          user_id,
          location,
          location_name,
        });
      }
      const token = await jwt.signUser(user);
      return res.status(201).json({
        success: true,
        message: "You have registered successfully.",
        user: user,
        token: token,
      });
    }
    return res.status(403).json({
      message: "You are already registered.",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.loggedIn = async function (req, res) {
  try {
    const { mobile_number, otp } = req.body;
    const otpIsTrue = await notification.verifyOtp(mobile_number, otp);

    if (otpIsTrue == true) {
      let user = await allUser.findOne({
        mobile_number,
      });
      if (user) {
        token = await jwt.signUser(user);

        return res.status(200).cookie("token", token).json({
          success: true,
          message: "You logged in successfully.",
          token: token,
          user: user,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "You are not registered.",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: otpIsTrue.message,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
// update profiles
exports.updateUserProfile = async (req, res) => {
  try {
    const updatedProfile = req.body;

    const data = await allUser.findOne({
      _id: req.token.id,
    });
    const updateObject = {};
    Object.keys(updatedProfile).forEach((key) => {
      if (updatedProfile[key]) {
        updateObject[key] = updatedProfile[key];
      }
    });
    if (data && !req.body.mobile_number) {
      const user_id = data._id;
      const user = await allUser.findByIdAndUpdate(
        req.token.id,
        {
          $set: updateObject,
        },
        {
          new: true,
        }
      );
      const result = await USER.findOneAndUpdate(
        {
          user_id: user_id,
        },
        {
          $set: updateObject,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        message: "User details update successfully.",
      });
    } else {
      return res.status(409).json({
        success: false,
        message: "It is not possible to change your mobile number.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await allUser.findById(req.token.id, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    if (!user) {
      return res.status(200).json({
        message: "No users found",
      });
    }
    if(user.role=="user"){
    const otherDetails  = await USER.findOne(
      { user_id: req.token.id },
      {
        createdAt: 0,
        updatedAt: 0,
        favourite: 0,
        booking: 0,
        __v: 0,
        _id: 0,
        user_id: 0,
      }
    );
    result = await BOOKING.find({
      user_id: req.token.id,
    });
    return res.status(200).json({
      profileDetails:{user , otherDetails ,bookingLength:result.length}
    });
  }
  return res.status(200).json({userDetails:user})
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.addAndRemovefavourites = async (req, res) => {
  try {
    const user_id = req.token.id;
    const turf_id = req.params.id;
    let user = await USER.findOne({
      user_id: user_id,
      favourite: turf_id,
    });
    if (user) {
      user = await USER.updateOne(
        {
          user_id: user_id,
        },
        {
          $pull: {
            favourite: turf_id,
          },
        }
      );
    } else {
      user = await USER.updateOne(
        {
          user_id: user_id,
        },
        {
          $addToSet: {
            favourite: turf_id,
          },
        }
      );
    }
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.getfavourites = async (req, res) => {
  try {
    const favourite = await USER.findOne(
      {
        user_id: req.token.id,
      },
      {
        favourite: 1,
      }
    );
    const data = await Turf.find(
      {
        _id: {
          $in: favourite.favourite,
        },
      },
      {
        turfname: 1,
        location_name: 1,
        rating: 1,
        services: 1,
      }
    );
    if (data.length == 0) {
      return res.status(200).json({
        message: "There are no favourites found",
      });
    }
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
//admin access
exports.getAllUser = async (req, res) => {
  try {
    const user = await allUser.find({
      role: "user",
    });
    if (!user) {
      return res.status(200).json({
        message: "No user found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAllMerchant = async (req, res) => {
  try {
    const user = await allUser.find({
      role: "merchant",
    });
    if (!user) {
      return res.status(200).json({
        message: "No merchant persent",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.blockUserAndTurf = async (req, res) => {
  try {
    console.log(req.query);
    if (req?.query?.flage == "true") {
      const user = await allUser.findOneAndUpdate(
        {
          _id: req.params.user_id,
        },
        {
          $set: {
            user_status: "blocked",
          },
        }
      );
      console.log(user);
      let turf;
      if (user?.role == "merchant") {
        turf = await Turf.findOneAndUpdate(
          {
            marchent_id: user._id,
          },
          {
            $set: {
              verify: false,
            },
          }
        );
      }
      return res.status(202).json({
        message: "User has been blocked successful",
      });
    }
    const user = await allUser.findOneAndUpdate(
      {
        _id: req.params.user_id,
      },
      {
        $set: {
          user_status: "unblocked",
        },
      }
    );
    let turf;
    console.log(user);
    if (user?.role == "merchant") {
      turf = await Turf.findOneAndUpdate(
        {
          marchent_id: user._id,
        },
        {
          $set: {
            verify: true,
          },
        }
      );
    }
    return res.status(202).json({
      message: "User has been unblock successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.blockUser = async (req, res) => {
  try {
    let blockUser = await allUser.find({
      user_status: "blocked",
    });
    if (blockUser.length) {
      return res.status(200).json({
        userDetails: blockUser,
      });
    }
    return res.status(200).json({
      message: "blocked users don't exist anymore.",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.registerRazorpay = async (req, res) => {
  try {
    console.log(req.token.id, "fghjk");
    let userData = await allUser.findById(
      { _id: req.token.id },
      { fullname: 1, mobile_number: 1, _id: 1 }
    );
    console.log(userData);
    let turfDetails = await Turf.findOne(
      { marchent_id: userData._id },
      { location_name: 1, turfname: 1 }
    );
    console.log(turfDetails);
    if (userData && turfDetails) {
      let myHeaders = new Headers();
      myHeaders.append("Content-type", "application/json");
      myHeaders.append(
        "Authorization",
        "Basic " +
          base64.encode(process.env.key_id + ":" + process.env.key_secret)
      );

      let raw = JSON.stringify({
        email: req.body.email,
        phone: userData.mobile_number,
        type: "route",
        reference_id: `${userData.mobile_number}`,
        legal_business_name: turfDetails.turfname,
        business_type: "partnership",
        contact_name: userData.fullname,
        profile: {
          category: "gaming",
          subcategory: "gaming_marketplace",
          addresses: {
            registered: {
              street1: req.body.flate,
              street2: req.body.location,
              city: req.body.city,
              state: req.body.state,
              postal_code: req.body.postal_code,
              country: "IN",
            },
          },
        },
      });

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      let data = await fetch(
        "https://api.razorpay.com/v2/accounts",
        requestOptions
      );
      let account_id = await data.json();
      if (account_id.id) {
        await Turf.findByIdAndUpdate(turfDetails._id, {
          $set: {
            razorpay_key: account_id.id,
          },
        });
        return res
          .status(200)
          .json({ message: "Your account link successfully" });
      }
      return res.status(400).json(account_id.error.description);
    }
    return res.status(400).json({ message: "Enter right details" });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
