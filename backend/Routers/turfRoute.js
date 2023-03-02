const express=require('express');
const router=express.Router();

const TURF = require("../Controller/turfController")
const{isAuthenticated,isAdmin}=require('../Middlewares/auth')



router.get("/nearestTurf",TURF.nearestfindTurf)
router.get("/getAllTurf",TURF.showAllTurf)

router.get("/getTurfDeatails/:id",TURF.getTurfDeatails)
router.get("/getPlaygroundDeatails/:id",TURF.playgroundDeatails)

router.post("/profileUpload/:id",isAuthenticated,TURF.uploadProfile)
router.post("/imagesUpload/:id",isAuthenticated,TURF.imagesUpload)
router.get("/turfDeatails/:id",isAuthenticated,TURF.TurDeatails)
//adminverified
router.get("/getVerificationRequest",isAdmin,TURF.verification)
router.put("/turfVerify",isAdmin,TURF.verified)



module.exports=router;
