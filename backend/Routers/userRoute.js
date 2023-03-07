const express=require('express');
const router=express.Router();
const allUser = require("../Controller/userController")
const{isAuthenticated,isAdmin}=require('../Middlewares/auth')


//login and register and logout
router.post("/sendOtp",allUser.sendOtp)
router.post("/registerUser",allUser.veryfiyUser)

//register turf 
router.post("/login/verifyOtp",allUser.loggedIn)

//upload profile
router.put("/userUpdate",isAuthenticated,allUser.updateUserProfile)
router.get("/getUser",isAuthenticated,allUser.getUser)
router.patch("/addAndRemoveFavourites",isAuthenticated,allUser.addAndRemovefavourites)
router.get("/showFavourites",isAuthenticated,allUser.getfavourites)




//admin
router.get("/getAllUser",isAdmin,allUser.getAllUser)
router.get("/getTurfUser",isAdmin,allUser.getAllturfs)
router.put("/blockUserAndTurf/:id",isAdmin,allUser.blockUserAndTurf)
router.put("/unblockUserAndTurf/:id",isAdmin,allUser.unblockUserAndTurf)






module.exports=router;