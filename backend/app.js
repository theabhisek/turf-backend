const express = require('express')

const app = express();
const bodyParser = require("body-parser")
app.use('/web', express.static('public'));
const fileUpload = require("express-fileupload")
// const cookieParser=require('cookie-parser')


// //using middlewares
app.use(express.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true
}))

//importing routes￼--
const user = require('./Routers/userRoute')
const turf = require('./Routers/turfRoute')
const booking = require('./Routers/bookingRoute')


app.use('/api/v1/user', user)
app.use('/api/v1/turf', turf)
app.use('/api/v1/booking', booking)

module.exports = app;
