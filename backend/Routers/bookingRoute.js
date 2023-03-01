const express=require('express');

const router=express.Router();
const{isAuthenticated}=require('../Middlewares/auth')

const Booking =  require("../Controller/bookingController")
router.get("/listAllBooking",Booking.showBookings)
router.post("/createBoooking",Booking.creteBooking)
 module.exports=router