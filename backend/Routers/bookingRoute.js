const express=require('express');


const router=express.Router();
const{isAuthenticated,isAdmin}=require('../Middlewares/auth')

const Booking =  require("../Controller/bookingController")
//for user
router.get("/myBooking",isAuthenticated,Booking.showMyBooking)
router.post("/createBoooking",Booking.creteBooking)
//admin
router.get("/listAllBooking",isAdmin,Booking.showAllBookings)
router.get("/bookingDetails/:id",isAdmin,Booking.bookingDetails)
router.get("/turfAllBooking",isAdmin,Booking.turfAllBooking)
router.get("/singleBooking/:id",isAdmin,Booking.singleBookingDetails)
router.get("/allCollection",isAdmin,Booking.allCollectionOfTurfs)
router.get("/allCollectionSingleTurf",isAdmin,Booking.allCollectionOfTurf)





 module.exports=router