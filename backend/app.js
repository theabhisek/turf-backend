const express=require('express')
const app= express();
// const cookieParser=require('cookie-parser')

const bodyParser=require("body-parser")

// //using middlewares
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
// app.use(cookieParser())
app.use(express.json())


//importing routes
const router=express.Router();
const user=require('./Routers/userRoute')
const turf=require('./Routers/turfRoute')
const booking=require('./Routers/bookingRoute')

// //using routes
app.use('/api/v2',user)
// app.use('/api/turf',turf)
// app.use('/api/booking',booking)



module.exports=app;