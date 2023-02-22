const express=require('express');
const router=express.Router();
const allUser = require("../Controller/userController")
const{isAuthenticated}=require('../Middlewares/auth')


//login and register and logout
router.post("/registerUser",allUser.createOtp)
router.post("/registerUser/verifyOtp",allUser.veryfiyUser)

//register turf 
router.post("/registerTurf",allUser.createOtp)
router.post("/registerTurf/verifyOtp",allUser.veryfiyTurf)

router.post("/login",allUser.login)
router.post("/login/verifyOtp",allUser.loggedIn)

//
router.put("/userUpdate/:id",isAuthenticated,allUser.updateUserProfile)
router.get("/getUser",isAuthenticated,allUser.getUser)

router.get("/nearestTurf",isAuthenticated,allUser.findTurf)




module.exports=router;