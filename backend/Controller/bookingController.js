require("dotenv").config({
  path: "backend/database/.env",
});
const allUser = require("../Models/allUserModels");
const Turf = require("../Models/turfModels");
const USER = require("../Models/userModels");
const BOOKING = require("../Models/bookingModels");
const { bookingValidation } = require("../Middlewares/slots");

var Razorpay = require("razorpay");
let instance = new Razorpay({
  key_id: process.env.key_id, // your `KEY_ID`
  key_secret: process.env.key_secret, // your `KEY_SECRET`
});

//admin
exports.showAllBookings = async (req, res) => {
  try {
    const { currentDate } = req.query;
    if (currentDate) {
      const desiredDate = new Date(currentDate);
      let data = await BOOKING.find({
        createdAt: {
          $gte: desiredDate,
        },
      });
      return res.status(200).json({
        data: data,
      });
    } else {
      let data = await BOOKING.find({});
      return res.status(200).json({
        data: data,
      });
    }
  } catch (err) {
    return res.status(400).json({
      err: err.messsage,
    });
  }
};

exports.bookingDetails = async (req, res) => {
  try {
    console.log(req.params);
    let data = await BOOKING.find({
      _id: req.params.id,
    });
    if (data) {
      return res.status(200).json({
        data: data,
      });
    }
    return res.status(200).json({
      messsage: "Booking details not found",
    });
  } catch (err) {
    return res.status(400).json({
      err: err.messsage,
    });
  }
};

exports.turfAllBooking = async (req, res) => {
  try {
    const { currentDate } = req.query;
    console.log(req.query);
    if (currentDate) {
      const desiredDate = new Date(currentDate);
      let data = await BOOKING.find({
        turf_id: req.query.turf_id,
        createdAt: {
          $gte: desiredDate,
        },
      });
      return res.status(200).json({
        data,
        data,
      });
    } else {
      let data = await BOOKING.find({
        turf_id: req.query.turf_id,
      });
      console.log(data);
      return res.status(200).json({
        data: data,
      });
    }
  } catch (err) {
    return res.status(500).json({
      err: err.messsage,
    });
  }
};

exports.singleBookingDetails = async (req, res) => {
  try {
    let data = await BOOKING.findOne({
      _id: req.params.id,
    });
    if (data) {
      return res.status(200).json({
        data: data,
      });
    }
    return res.status(200).json({
      messsage: "Booking details not found.",
    });
  } catch (err) {
    return res.status(500).json({
      err: err.messsage,
    });
  }
};

exports.allCollectionOfTurfs = async (req, res) => {
  try {
    const { currentDate } = req.query;
    let user;
    if (currentDate) {
      const date = new Date(currentDate);
      console.log("fghjk");
      user = await BOOKING.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
              ),
              $lt: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total_price: {
              $sum: "$booking_price",
            },
          },
        },
      ]);
    } else {
      user = await BOOKING.aggregate([
        {
          $group: {
            _id: null,
            total_price: {
              $sum: "$booking_price",
            },
          },
        },
      ]);
    }

    return res.status(200).json({
      total_price: user[0].total_price,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.allCollectionOfTurf = async (req, res) => {
  try {
    const { currentDate, turf_id } = req.query;
    let user;
    console.log(turf_id);
    if (currentDate && turf_id) {
      const date = new Date(currentDate);
      user = await BOOKING.aggregate([
        {
          $match: {
            turf_id: mongoose.Types.ObjectId(turf_id),
            createdAt: {
              $gte: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
              ),
              $lt: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1
              ),
            },
          },
        },
        {
          $group: {
            _id: "$turf_id",
            total_price: {
              $sum: "$booking_price",
            },
          },
        },
      ]);
      console.log(user);
    } else {
      user = await BOOKING.aggregate([
        {
          $match: {
            turf_id: mongoose.Types.ObjectId(turf_id),
          },
        },
        {
          $group: {
            _id: "$turf_Id",
            total_price: {
              $sum: "$booking_price",
            },
          },
        },
      ]);
    }
    if (user.length)
      return res.status(200).json({
        total_price: user[0].total_price,
      });
    return res.status(200).json({
      message: "Booking not found",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
//user
exports.createDetails = async (req, res) => {
  try {
    const { turf_id, date, day, slots, playground_id, price } = req.body;
    let validate = await bookingValidation(
      (availableTime = []),
      date,
      day,
      playground_id,
      turf_id,
      slots
    );
    if (validate == false) {
      return res.status(403).json({
        message: "Can't create booking",
      });
    }
    if (validate == true) {
      let bookingData = {};
      let userDetails = {};
      let turf_booking_list = await Turf.findById(turf_id, {
        location: 1,
        location_name: 1,
        turfname: 1,
        razorpay_key: 1,
      });
      bookingData.day = day;
      bookingData.turf_name = turf_booking_list.turfname;
      bookingData.longitude = turf_booking_list.location.coordinates[0];
      bookingData.latitude = turf_booking_list.location.coordinates[1];
      bookingData.location_name = turf_booking_list.location_name;
      bookingData.date = date;
      bookingData.day = day;
      bookingData.startTime = slots[0].start;
      bookingData.endTime = slots[slots.length - 1].end;
      userDetails.fullname = req.token.fullname;
      userDetails.mobile_number = req.token.mobile_number;
      userDetails.price = price * slots.length;
      userDetails.slotsSize = slots.length; //
      return res
        .status(200)
        .json({ trufDetails: bookingData, userDetails: userDetails });
    }
    throw new Error(validate);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.showMyBooking = async (req, res) => {
  try {
    const { currentDate, booking_id } = req.query;
    let result;
    if (currentDate) {
      const desiredDate = new Date(currentDate);
      const tomorrowDate = new Date(currentDate);
      tomorrowDate.setDate(desiredDate.getDate() + 1);
      result = await BOOKING.find({
        user_id: req.token.id,
        createdAt: {
          $gte: currentDate,
          $lt: tomorrowDate,
        },
      });
    } else if (booking_id) {
      result = await BOOKING.findOne({
        _id: booking_id,
      });
    } else {
      result = await BOOKING.find({
        user_id: req.token.id,
      });
    }
    return res.status(200).json({
      messsage: "booking details",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      err: err.messsage,
    });
  }
};

exports.createOrdar = async (req, res) => {
  try {
    let price = req.query.price * 100;
    let turfDetails = await Turf.findOne(
      { _id: req.params.turf_id },
      { razorpay_key: 1 }
    );
    let adminAmount = price / 10;
    let merchantAmount = price - admin;
    let data = await instance.orders.create({
      amount: price,
      currency: "INR",
      transfers: [
        {
          account: "acc_LR8eQ15LztjAh8",
          amount: adminAmount,
          currency: "INR",
          //       on_hold: 1,
          // on_hold_until: 1671222870
        },
        {
          account: turfDetails.razorpay_key,
          amount: merchantAmount,
          currency: "INR",
          //on_hold: 0
          //on_hold_until: 1671222870
        },
      ],
    });
    return res.status(200).send({
      data: data.id,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      playground_id,
      startTime,
      endTime,
      razorpay_order_id,
      razorpay_signature,
      razorpay_payment_id,
      turf_id,
      booking_date,
      price
    } = req.body;
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log(razorpay_order_id, razorpay_payment_id);
    let crypto = require("crypto");
    let expectedSignature = crypto
      .createHmac("sha256",process.env.key_secret)
      .update(body.toString())
      .digest("hex");
    console.log("sig" + razorpay_signature);
    console.log("sig" + expectedSignature);
    let response = {
      status: "failure",
    };
    if (expectedSignature === razorpay_signature){
    for (let data of playground_id) {
      const turfDeatail = await BOOKING.create({
        user_id: req.token.id,
        turf_id,
        playground_id: data,
        booking_price: price,
        payment_mode: "online",
        payment_id: razorpay_payment_id,
        startTime: startTime,
        endTime: endTime,
        booking_date: booking_date,
      });
    }
    return res.status(200).json({
      success: true,
      messsage: "Booking create successfully",
    });
}
return res.status(400).json(response)
  } catch (err) {
    return res.status(500).json({ messsage: err.message });
  }
};
