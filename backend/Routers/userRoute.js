const express=require('express');
const router=express.Router();
const allUser = require("../Controller/userController")
const{isAuthenticated}=require('../Middlewares/auth')


//login and register and logout
router.post("/createOtp",allUser.createOtp)
router.post("/registerUser",allUser.veryfiyUser)

//register turf 
router.post("/login/verifyOtp",allUser.loggedIn)

//upload profile
router.put("/userUpdate/:id",isAuthenticated,allUser.updateUserProfile)
router.get("/getUser",isAuthenticated,allUser.getUser)



module.exports=router;