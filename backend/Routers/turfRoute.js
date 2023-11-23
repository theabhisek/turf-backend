const express = require('express');
const router = express.Router();
const TURF = require("../Controller/turfController")
const {
    isAuthenticated,
    isAdmin,
    isMerchant
} = require('../Middlewares/auth')

//user
router.get("/nearest", TURF.nearestfindTurf)
router.get("/list", TURF.showAllTurf)
router.get("/:turf_id", TURF.getTurfDeatails)
router.get("/:turf_id/play_ground", TURF.playgroundDeatails)
//merchant
router.post("/merchant", isMerchant, TURF.createTurf)
router.get("/merchant/:turf_id", isMerchant, TURF.TurfDeatails)
//upload images
router.get("/merchant/profile_upload/:turf_id", isMerchant, TURF.getProfile)
router.post("/merchant/profile_upload/:turf_id", isMerchant, TURF.uploadProfile)
router.delete("/merchant/profile_upload/:turf_id", isMerchant, TURF.deleteImage)
router.get("/merchant/images_upload/:turf_id", isMerchant, TURF.getImages)
router.post("/merchant/images_upload/:turf_id", isMerchant, TURF.imagesUpload)
router.put("/merchant/change_status/:turf_id", isMerchant, TURF.changStatus)

//admin
router.get("/admin/turf_list", isAdmin, TURF.getAllturfs)
router.get("/admin/turf_details/:turf_id", isAdmin, TURF.TurfDeatails)
router.get("/admin/verification_request", isAdmin, TURF.verificationRequest)
router.patch("/admin/verification_request", isAdmin, TURF.verified)

module.exports = router;