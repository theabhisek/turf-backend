const mongoose=require('mongoose')
const cloudinary = require("cloudinary")
mongoose.set('strictQuery', false);



const url = "mongodb://localhost:27017/turf";
const username = 'abhishek';
const password = '12345';
const dbName = 'turf';

// Set up the options for the MongoDB connection
const options = {
  user: username,
  pass: password,
  dbName: dbName,
  useNewUrlParser: true,
  useUnifiedTopology: true
};
exports.connectDb= function (){
  mongoose.connect(url, options)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log(err.message);
  });
 }

// Connect to the MongoDB database


cloudinary.config({
    cloud_name: 'djgdlchfe',
    api_key: '465259525437394',
    api_secret: 'QjoIBhg-fzTHFU7WcLLWIRHYj9o'
  });