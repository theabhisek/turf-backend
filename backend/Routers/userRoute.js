const express = require('express');
const router = express.Router();
const allUser = require("../Controller/userController")
const {
    isAuthenticated ,
    isAdmin ,
    isMerchant ,
    isVerify
} = require('../Middlewares/auth')
const {
    mobileValidation,
    mobileOtpValidation,
    singUpValidation,
    updateUserValidation
} = require('../Middlewares/validation')

//login and register and logout
router.get("/send",mobileValidation, isVerify, allUser.sendOtp)

//register turf 
router.post("/verify", mobileOtpValidation, allUser.loggedIn)

router.post("/", singUpValidation, allUser.veryfiyUser)
router.put("/", updateUserValidation, isAuthenticated, allUser.updateUserProfile)
router.get("/", isAuthenticated, allUser.getUser)
router.patch("/favourites/:id", isAuthenticated, allUser.addAndRemovefavourites)
router.get("/favourites", isAuthenticated, allUser.getfavourites)

router.post("/register_account", isMerchant, allUser.registerRazorpay)
//admin 
router.get("/admin/user_list", isAdmin, allUser.getAllUser)
router.get("/admin/merchant_list", isAdmin, allUser.getAllMerchant)
router.patch("/admin/user/block_unblock/:user_id", isAdmin, allUser.blockUserAndTurf)
router.get("/admin/user/block_unblock", isAdmin, allUser.blockUser)

module.exports = router;
