const express=require('express');

const router=express.Router();
const{isAuthenticated}=require('../Middlewares/auth')

const Booking =  require("../Controller/bookingController")
router.get("/listAllBooking",isAuthenticated,Booking.showBookings)
