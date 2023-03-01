const express=require('express');
const router=express.Router();

const TURF = require("../Controller/turfController")
const{isAuthenticated}=require('../Middlewares/auth')



router.get("/nearestTurf",TURF.nearestfindTurf)
router.get("/getTurfDeatails/:id",TURF.getTurfDeatails)
router.get("/getPlaygroundDeatails/:id",TURF.playgroundDeatails)

router.post("/profileUpload/:id",isAuthenticated,TURF.uploadProfile)
router.post("/imagesUpload/:id",isAuthenticated,TURF.imagesUpload)
// router.post("//",isAuthenticated,TURF.imagesUpload)

module.exports=router;
