const express = require('express');
const router = express.Router();
const {
    isAuthenticated,
    isAdmin
} = require('../Middlewares/auth')

const Booking = require("../Controller/bookingController")
//for user
router.get("/" , isAuthenticated,Booking.showMyBooking)
router.post("/",isAuthenticated, Booking.createDetails)
router.get("/order/:turf_id", isAuthenticated,Booking.createOrdar)
router.post("/payment/verify",isAuthenticated, Booking.verifyPayment)

//admin
router.get("/user_booking_list", isAdmin, Booking.showAllBookings)
router.get("/user_booking_details/:id", isAdmin, Booking.bookingDetails)
router.get("/turf_booking_list", isAdmin, Booking.turfAllBooking)
router.get("/singleBooking/:id", isAdmin, Booking.singleBookingDetails)
router.get("/allCollection", isAdmin, Booking.allCollectionOfTurfs)
router.get("/allCollectionSingleTurf", isAdmin, Booking.allCollectionOfTurf)

module.exports = router
